#!/usr/bin/env python3
"""Independent mechanical and semantic-risk audit for EP-P0-01 artifacts.

This validator intentionally does not declare semantic approval. It proves source
identity and mechanical integrity, then exposes conditions that require a human
semantic review (modality, atomicity, acceptance criteria, and traceability).
"""

from __future__ import annotations

import argparse
import csv
import hashlib
import json
import re
from collections import Counter
from pathlib import Path


EXPECTED_SOURCE = {
    "lines": 5337,
    "words": 8313,
    "bytes": 65976,
    "sha256": "53ff6b78255a979ed635ed113fb812b8ece5a7ed10933ad84773c9412d0f08f1",
}

REQUIRED_FIELDS = {
    "requirement_id",
    "parent_requirement_id",
    "exact_constitution_part",
    "exact_constitution_section",
    "verified_exact_line_range",
    "source_wording",
    "source_modality",
    "requirement_type",
    "delivery_target",
    "classification",
    "dependencies",
    "atomic_acceptance_criteria",
    "related_phase_0_document",
    "evidence_requirement",
    "owner_approval_state",
    "implementation_status",
}

ALLOWED_TYPES = {
    "Functional",
    "Non-functional",
    "Quality",
    "Process",
    "Deliverable",
    "Identity",
}

GENERIC_ACCEPTANCE_PREFIXES = (
    "An acceptance test confirms this statement:",
    "The named artifact exists, addresses this statement, and is traceable",
    "Schema, constraint, and data-level tests confirm this statement:",
    "A defined measurement or design review confirms this statement:",
    "Workflow and audit evidence confirm this statement:",
    "Operational execution or recovery evidence confirms this statement:",
    "Security review and negative-path tests confirm this statement:",
    "Contract and integration tests confirm this statement:",
)

PART_RANGES = {
    "Part 1": (1, 478),
    "Part 2": (479, 1054),
    "Part 3": (1055, 1640),
    "Part 4": (1641, 2032),
    "Part 5": (2033, 2506),
    "Part 6": (2507, 2992),
    "Part 7": (2993, 3564),
    "Part 8": (3565, 4194),
    "Part 9": (4195, 4752),
    "Part 10": (4753, 5337),
}


def sha256(data: bytes) -> str:
    return hashlib.sha256(data).hexdigest()


def parse_ranges(locator: str) -> list[tuple[int, int]]:
    parsed: list[tuple[int, int]] = []
    for token in locator.split(";"):
        match = re.fullmatch(r"\s*L(\d+)(?:[–-]L?(\d+))?\s*", token)
        if not match:
            raise ValueError(f"Invalid locator token: {token!r}")
        start = int(match.group(1))
        end = int(match.group(2) or match.group(1))
        parsed.append((start, end))
    return parsed


def source_wording_for(lines: list[str], locator: str) -> str:
    chunks: list[str] = []
    for start, end in parse_ranges(locator):
        chunks.append(" / ".join(line for line in lines[start - 1 : end] if line.strip()))
    return " || ".join(chunks)


def load_csv(path: Path) -> tuple[list[str], list[dict[str, str]]]:
    with path.open(encoding="utf-8", newline="") as handle:
        reader = csv.DictReader(handle)
        return list(reader.fieldnames or []), list(reader)


def source_identity(path: Path) -> tuple[dict[str, object], list[str]]:
    data = path.read_bytes()
    text = data.decode("utf-8")
    identity = {
        "lines": len(text.splitlines()),
        "words": len(text.split()),
        "bytes": len(data),
        "sha256": sha256(data),
    }
    return identity, text.splitlines()


def add_check(checks: list[dict[str, object]], name: str, passed: bool, details: object) -> None:
    checks.append({"name": name, "passed": passed, "details": details})


def audit(args: argparse.Namespace) -> dict[str, object]:
    identity, lines = source_identity(args.source)
    source_line_set = set(lines)
    fields, rows = load_csv(args.requirements)
    _, parents = load_csv(args.parents)
    parent_ids = {row["parent_requirement_id"] for row in parents}
    checks: list[dict[str, object]] = []

    add_check(checks, "Canonical source identity", identity == EXPECTED_SOURCE, identity)
    add_check(
        checks,
        "Required schema fields present",
        REQUIRED_FIELDS.issubset(fields),
        {"missing_columns": sorted(REQUIRED_FIELDS - set(fields)), "column_count": len(fields)},
    )

    blank_fields = Counter()
    for row in rows:
        for field in REQUIRED_FIELDS:
            if not row.get(field, "").strip():
                blank_fields[field] += 1
    add_check(checks, "Required values populated", not blank_fields, dict(blank_fields))

    ids = [row["requirement_id"] for row in rows]
    invalid_ids = [item for item in ids if not re.fullmatch(r"REQ-\d{3}\.\d{2,3}", item)]
    duplicate_ids = sorted(item for item, count in Counter(ids).items() if count > 1)
    add_check(checks, "Atomic IDs valid and unique", not invalid_ids and not duplicate_ids, {
        "invalid": invalid_ids,
        "duplicates": duplicate_ids,
        "count": len(ids),
    })

    missing_parents = sorted({row["parent_requirement_id"] for row in rows} - parent_ids)
    add_check(checks, "Parent references resolve", not missing_parents, missing_parents)

    if args.section_coverage:
        _, coverage_rows = load_csv(args.section_coverage)
        unresolved_sections = [
            row["heading_line"]
            for row in coverage_rows
            if "UNRESOLVED" in row.get("disposition", "")
        ]
        coverage_parent_ids = {
            row["structural_parent_id"]
            for row in coverage_rows
            if row.get("structural_parent_id") not in {"", "None"}
        }
        duplicate_heading_lines = sorted(
            line for line, count in Counter(row["heading_line"] for row in coverage_rows).items() if count > 1
        )
        coverage_ok = (
            len(coverage_rows) == 210
            and not unresolved_sections
            and not duplicate_heading_lines
            and coverage_parent_ids == parent_ids
        )
        add_check(checks, "Section-by-section coverage reconciles", coverage_ok, {
            "detected_heading_count": len(coverage_rows),
            "unresolved_headings": unresolved_sections,
            "duplicate_heading_lines": duplicate_heading_lines,
            "missing_parent_coverage": sorted(parent_ids - coverage_parent_ids),
            "unknown_parent_coverage": sorted(coverage_parent_ids - parent_ids),
        })

    locator_errors: list[dict[str, object]] = []
    wording_mismatches: list[str] = []
    digest_mismatches: list[str] = []
    part_mismatches: list[str] = []
    covered_lines: set[int] = set()
    for row in rows:
        rid = row["requirement_id"]
        try:
            ranges = parse_ranges(row["verified_exact_line_range"])
        except ValueError as exc:
            locator_errors.append({"id": rid, "error": str(exc)})
            continue
        for start, end in ranges:
            if not 1 <= start <= end <= len(lines):
                locator_errors.append({"id": rid, "range": [start, end]})
                continue
            covered_lines.update(range(start, end + 1))
            part_start, part_end = PART_RANGES.get(row["exact_constitution_part"], (0, -1))
            if start < part_start or end > part_end:
                part_mismatches.append(rid)
        if source_wording_for(lines, row["verified_exact_line_range"]) != row["source_wording"]:
            wording_mismatches.append(rid)
        digest = row.get("source_digest_sha256")
        if digest and digest != sha256(row["source_wording"].encode("utf-8")):
            digest_mismatches.append(rid)

    add_check(checks, "Locators parse and remain in bounds", not locator_errors, locator_errors[:50])
    add_check(checks, "Locators stay within declared Part", not part_mismatches, part_mismatches[:50])
    add_check(checks, "Source wording equals cited canonical lines", not wording_mismatches, wording_mismatches[:50])
    add_check(checks, "Source wording digests match", not digest_mismatches, digest_mismatches[:50])

    invalid_sections = [row["requirement_id"] for row in rows if row["exact_constitution_section"] not in source_line_set]
    add_check(checks, "Section headings match canonical wording exactly", not invalid_sections, {
        "invalid_count": len(invalid_sections),
        "sample": invalid_sections[:50],
    })

    invalid_types = Counter(row["requirement_type"] for row in rows if row["requirement_type"] not in ALLOWED_TYPES)
    add_check(checks, "Requirement types use approved taxonomy", not invalid_types, dict(invalid_types))

    may_rows = [row["requirement_id"] for row in rows if row["source_modality"] == "MAY"]
    add_check(checks, "MAY clauses excluded from formal REQ total", not may_rows, {
        "count": len(may_rows),
        "ids": may_rows,
    })

    explicit_modality_conflicts = []
    for row in rows:
        tokens = {
            token.upper()
            for token in ("must", "should")
            if re.search(rf"\b{token}\b", row["source_wording"], re.IGNORECASE)
        }
        if len(tokens) == 1 and row["source_modality"] not in tokens:
            explicit_modality_conflicts.append({
                "id": row["requirement_id"],
                "recorded": row["source_modality"],
                "source_token": next(iter(tokens)),
            })
    add_check(checks, "Explicit source modality matches recorded modality", not explicit_modality_conflicts, {
        "count": len(explicit_modality_conflicts),
        "rows": explicit_modality_conflicts,
    })

    generic_acceptance = [
        row["requirement_id"]
        for row in rows
        if row["atomic_acceptance_criteria"].startswith(GENERIC_ACCEPTANCE_PREFIXES)
    ]
    add_check(checks, "Acceptance criteria are requirement-specific and binary", not generic_acceptance, {
        "generic_count": len(generic_acceptance),
        "sample": generic_acceptance[:50],
    })

    mixed_modalities: list[dict[str, object]] = []
    for row in rows:
        tokens = sorted({
            token.upper()
            for token in ("must", "should", "may")
            if re.search(rf"\b{token}\b", row["source_wording"], re.IGNORECASE)
        })
        resolution = row.get("modality_resolution", "").strip()
        if len(tokens) > 1 and (not resolution or resolution.startswith("Single-modality")):
            mixed_modalities.append({
                "id": row["requirement_id"],
                "tokens": tokens,
                "resolution": resolution,
            })
    add_check(checks, "Mixed-modality citations manually resolved", not mixed_modalities, {
        "count": len(mixed_modalities),
        "rows": mixed_modalities,
    })

    placeholders = [
        row["requirement_id"]
        for row in rows
        if "pending ODR-001" in row["related_phase_0_document"]
    ]
    add_check(checks, "Related Phase 0 document IDs resolved", not placeholders, {
        "count": len(placeholders),
        "sample": placeholders[:50],
    })

    bundled = []
    for row in rows:
        segment_count = len(re.split(r" / | \|\| ", row["source_wording"]))
        summary = row["source_summary"]
        review = row.get("atomicity_review", "").strip()
        unresolved_review = not review or review.startswith("REQUIRES") or review.startswith("Pending")
        if (
            segment_count >= 5
            and "," in summary
            and re.search(r"\band\b", summary, re.IGNORECASE)
            and unresolved_review
        ):
            bundled.append({
                "id": row["requirement_id"],
                "source_segments": segment_count,
                "summary": summary,
            })
    add_check(checks, "Atomicity candidates manually resolved", not bundled, {
        "count": len(bundled),
        "sample": bundled[:50],
    })

    disposition_lines: set[int] = set()
    if args.dispositions:
        _, dispositions = load_csv(args.dispositions)
        for disposition in dispositions:
            for start, end in parse_ranges(disposition["line_range"]):
                disposition_lines.update(range(start, end + 1))
    if args.may_options:
        _, may_options = load_csv(args.may_options)
        for option in may_options:
            for start, end in parse_ranges(option["verified_exact_line_range"]):
                disposition_lines.update(range(start, end + 1))

    uncovered_normative = []
    normative = re.compile(r"\b(must|should|may|never|do not|only after|required)\b", re.IGNORECASE)
    for number, line in enumerate(lines, start=1):
        if number not in covered_lines and number not in disposition_lines and normative.search(line):
            uncovered_normative.append({"line": number, "text": line})
    add_check(checks, "All normative source lines cited", not uncovered_normative, uncovered_normative)

    register_counts = {}
    all_register_records: list[dict[str, str]] = []
    for label, path in (
        ("ODR", args.odr),
        ("DDR", args.ddr),
        ("EFE", args.efe),
        ("OCR", args.ocr),
    ):
        _, records = load_csv(path)
        all_register_records.extend(records)
        register_counts[label] = len(records)
        ids_for_register = [record["record_id"] for record in records]
        unique = len(ids_for_register) == len(set(ids_for_register))
        label_ok = all(record["record_type"] == label for record in records)
        derived_label_ok = label != "DDR" or all(
            record["label"] == "DERIVED PROPOSAL — REQUIRES ARCHITECTURE OR OWNER APPROVAL"
            for record in records
        )
        add_check(checks, f"{label} register integrity", unique and label_ok and derived_label_ok, {
            "count": len(records),
            "unique_ids": unique,
            "record_types_valid": label_ok,
            "derived_labels_valid": derived_label_ok,
        })

    known_register_ids = {record["record_id"] for record in all_register_records}
    missing_register_dependencies = []
    for record in all_register_records:
        referenced = set(re.findall(r"\b(?:ODR|DDR|EFE|OCR)-\d+\b", record.get("dependencies", "")))
        missing = sorted(referenced - known_register_ids)
        if missing:
            missing_register_dependencies.append({"id": record["record_id"], "missing": missing})
    add_check(checks, "Governance register dependencies resolve", not missing_register_dependencies, {
        "known_record_count": len(known_register_ids),
        "missing_references": missing_register_dependencies,
    })

    if args.reassessment:
        _, reassessments = load_csv(args.reassessment)
        expected_legacy_ids = {
            "REQ-006", "REQ-009", "REQ-019", "REQ-027", "REQ-031",
            "REQ-055", "REQ-058", "REQ-076", "REQ-080", "REQ-085",
        }
        actual_legacy_ids = {row["legacy_requirement_id"] for row in reassessments}
        complete = all(
            row.get("canonical_source", "").strip()
            and row.get("formal_replacement_ids", "").strip()
            and row.get("disposition", "").strip()
            and row.get("result", "").startswith("PASS")
            for row in reassessments
        )
        add_check(
            checks,
            "Flagged predecessor reassessment complete",
            actual_legacy_ids == expected_legacy_ids and complete,
            {
                "expected_ids": sorted(expected_legacy_ids),
                "actual_ids": sorted(actual_legacy_ids),
                "records_complete": complete,
            },
        )

    hard_failures = [check for check in checks if not check["passed"]]
    return {
        "document": "EP-P0-01 independent audit",
        "source": identity,
        "formal_requirement_count": len(rows),
        "counts": {
            "by_part": dict(Counter(row["exact_constitution_part"] for row in rows)),
            "by_modality": dict(Counter(row["source_modality"] for row in rows)),
            "by_classification": dict(Counter(row["classification"] for row in rows)),
            "by_type": dict(Counter(row["requirement_type"] for row in rows)),
            "by_delivery_target": dict(Counter(row["delivery_target"] for row in rows)),
            "governance_registers": register_counts,
        },
        "checks": checks,
        "summary": {
            "passed_checks": len(checks) - len(hard_failures),
            "failed_checks": len(hard_failures),
            "verdict": "PASS — ELIGIBLE FOR SEMANTIC REVIEW" if not hard_failures else "FAIL — REVISION REQUIRED",
        },
    }


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--source", type=Path, required=True)
    parser.add_argument("--requirements", type=Path, required=True)
    parser.add_argument("--parents", type=Path, required=True)
    parser.add_argument("--odr", type=Path, required=True)
    parser.add_argument("--ddr", type=Path, required=True)
    parser.add_argument("--efe", type=Path, required=True)
    parser.add_argument("--ocr", type=Path, required=True)
    parser.add_argument("--dispositions", type=Path)
    parser.add_argument("--may-options", type=Path)
    parser.add_argument("--reassessment", type=Path)
    parser.add_argument("--section-coverage", type=Path)
    parser.add_argument("--output", type=Path)
    args = parser.parse_args()
    result = audit(args)
    rendered = json.dumps(result, indent=2, ensure_ascii=False) + "\n"
    if args.output:
        args.output.parent.mkdir(parents=True, exist_ok=True)
        args.output.write_text(rendered, encoding="utf-8")
    else:
        print(rendered, end="")


if __name__ == "__main__":
    main()
