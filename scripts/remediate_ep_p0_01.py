#!/usr/bin/env python3
"""Build a corrected EP-P0-01 candidate from the byte-verified source.

The rejected candidate is used only as an extraction inventory. Every retained
clause is re-anchored to the canonical source, reclassified, and re-numbered under
the exact active Constitution heading. Pure MAY options are moved to a separate,
non-counted trace register.
"""

from __future__ import annotations

import argparse
import csv
import hashlib
import json
import re
from collections import Counter, defaultdict
from copy import deepcopy
from pathlib import Path


FIELDS = [
    "requirement_id",
    "parent_requirement_id",
    "exact_constitution_part",
    "exact_constitution_section",
    "verified_exact_line_range",
    "source_wording",
    "source_digest_sha256",
    "source_summary",
    "source_modality",
    "requirement_type",
    "delivery_target",
    "classification",
    "responsible_layer",
    "dependencies",
    "atomic_acceptance_criteria",
    "related_phase_0_document",
    "evidence_requirement",
    "owner_approval_state",
    "implementation_status",
    "predecessor_requirement_id",
    "atomicity_review",
    "modality_resolution",
]

TYPE_MAP = {
    "Functional": "Functional",
    "Non-functional": "Non-functional",
    "Governance": "Process",
    "Documentation": "Deliverable",
    "Business Rule": "Functional",
    "Security": "Quality",
    "Data": "Functional",
    "Compliance": "Quality",
    "API": "Functional",
    "Operational": "Process",
}

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

DROP_TO_MAY = {
    "REQ-013.03",
    "REQ-013.04",
    "REQ-013.05",
    "REQ-013.06",
    "REQ-013.07",
    "REQ-019.03",
    "REQ-024.02",
    "REQ-026.02",
    "REQ-039.02",
    "REQ-045.02",
    "REQ-049.02",
    "REQ-060.09",
    "REQ-060.10",
    "REQ-060.11",
    "REQ-060.12",
    "REQ-060.13",
    "REQ-060.14",
    "REQ-068.05",
    "REQ-070.24",
    "REQ-071.16",
    "REQ-078.12",
    "REQ-082.04",
}

REMOVE_FOR_REPLACEMENT = {
    "REQ-001.05",
    "REQ-002.08",
    "REQ-002.09",
    "REQ-004.11",
    "REQ-007.05",
    "REQ-007.06",
    "REQ-007.07",
    "REQ-007.08",
    "REQ-007.09",
    "REQ-007.10",
    "REQ-007.11",
    "REQ-007.12",
}

SEMANTIC_DROP_TO_MAY = {
    "REQ-012.02",  # lifecycle illustration; owner clarifications govern validation/maturity transitions
    "REQ-040.10",  # confirmation-dialog example; controlling clear-feedback rule is separate
    "REQ-032.02",  # audit event examples; overarching logging rule is separate
    "REQ-044.08",  # background-work examples; separation and architecture rules are separate
    "REQ-054.14",  # audit-domain examples; immutable significant-action rule is separate
    "REQ-055.02",  # retention category examples; policy requirement is separate
    "REQ-064.02",  # asynchronous workload examples; processing requirement is separate
    "REQ-078.14",  # retention mechanism examples; design obligation is separate
    "REQ-093.09",  # explicitly suggested roadmap statuses
} | {
    # Lists introduced as examples or “such as” are traceable source options,
    # not independently binding requirements.
    *(f"REQ-025.{number:02d}" for number in range(3, 15)),
    *(f"REQ-042.{number:02d}" for number in range(3, 12)),
    *(f"REQ-043.{number:02d}" for number in range(2, 13)),
    *(f"REQ-049.{number:02d}" for number in range(3, 9)),
    *(f"REQ-051.{number:02d}" for number in range(2, 8)),
    *(f"REQ-059.{number:02d}" for number in range(11, 16)),
}

CORE_REPLACEMENT_IDS = {
    "REQ-070.01",  # keep priority principle; move suggested order to source options
    "REQ-074.05",  # keep unrealistic-claim prohibition; move quoted examples to source options
    "REQ-081.08",  # keep option-analysis obligation; move named examples to source options
    "REQ-085.01",  # keep reliable-job-system obligation; move workload examples to source options
}


def item_specs(lead: str, pairs: list[tuple[int | str, str]], template: str) -> list[tuple[str, str]]:
    output = []
    for locator, label in pairs:
        locator_text = f"L{locator}" if isinstance(locator, int) else locator
        output.append((f"{lead}; {locator_text}" if lead else locator_text, template.format(item=label)))
    return output


SPLIT_DEFINITIONS: dict[str, dict[str, object]] = {
    "REQ-001.01": {
        "items": [
            ("L11", "The delivery agent is not treated as a simple coding assistant."),
            ("L13", "The delivery agent operates as one coordinated elite professional team."),
        ]
        + item_specs(
            "L15",
            [
                (17, "CEO"), (19, "CTO"), (21, "Product Owner"), (23, "Business Consultant"),
                (25, "Product Strategist"), (27, "Startup Advisor"), (29, "SaaS Architect"),
                (31, "Senior Software Architect"),
                (33, "Senior PHP/Laravel Engineer, or a better justified stack specialist"),
                (35, "Database Architect"), (37, "Cloud Infrastructure Engineer"),
                (39, "DevOps Engineer"), (41, "Security Engineer"), (43, "QA Engineer"),
                (45, "Performance Engineer"), (47, "UI Designer"), (49, "UX Researcher"),
                (51, "SEO Expert"), (53, "Digital Marketing Strategist"),
                (55, "Content Marketing Expert"), (57, "Technical Writer"),
                (59, "Documentation Specialist"), (61, "System Analyst"),
            ],
            "The delivery process includes the perspective and responsibilities of a {item}.",
        ),
        "type": "Process", "modality": "MUST", "classification": "CD", "target": "Pre-implementation deliverable",
    },
    "REQ-001.02": {
        "items": [
            ("L63–L65", "The work produces a complete business ecosystem before implementation begins."),
            ("L63–L65", "The work produces a complete software ecosystem before implementation begins."),
        ],
        "type": "Process", "modality": "MUST", "classification": "CD", "target": "Pre-implementation deliverable",
    },
    "REQ-001.03": {
        "items": [
            ("L69–L71", "EarnPearls is designed and built as a modern rewards platform."),
            ("L69–L71", "EarnPearls is designed and built as a scalable rewards platform."),
            ("L69–L71", "EarnPearls is designed and built as a secure rewards platform."),
            ("L69–L71", "EarnPearls is designed and built as a trustworthy rewards platform."),
            ("L69–L71", "EarnPearls is designed and built as a highly optimized rewards platform."),
            ("L73", "EarnPearls is not treated as merely a survey website."),
            ("L75", "The initial EarnPearls launch includes surveys."),
            ("L75", "The initial EarnPearls launch includes only a limited number of partner offers."),
        ],
        "type": "Non-functional", "modality": "MUST", "classification": "CD",
    },
    "REQ-003.03": {
        "items": item_specs("L315", [(317, "modern"), (319, "clean"), (321, "premium"), (323, "friendly"), (325, "professional"), (327, "transparent"), (329, "trustworthy"), (331, "simple"), (333, "fast")], "The EarnPearls brand personality is {item}."),
        "type": "Identity", "modality": "SHOULD", "classification": "REC",
    },
    "REQ-005.10": {
        "items": [
            ("L427", "USD is the source of truth for calculations."),
            ("L427", "USD is the source of truth for accounting."),
            ("L427", "USD is the source of truth for wallet balances."),
            ("L427", "USD is the source of truth for provider earnings."),
            ("L427", "USD is the source of truth for business reporting."),
        ],
        "type": "Functional", "modality": "MUST", "classification": "CBR",
    },
    "REQ-008.01": {
        "items": item_specs("L481–L483", [(483, "trust"), (483, "simplicity"), (483, "transparency"), (483, "performance"), (483, "scalability")], "The platform prioritizes {item}."),
        "type": "Non-functional", "modality": "MUST", "classification": "CD",
    },
    "REQ-008.02": {
        "items": item_specs("", [(485, "modern"), (485, "fast"), (485, "intuitive"), (485, "highly polished")], "The product feels {item}."),
        "type": "Non-functional", "modality": "SHOULD", "classification": "REC", "layer": "Frontend handoff",
    },
    "REQ-008.03": {
        "items": [
            ("L487–L491", "A design decision is reconsidered when it does not improve user trust."),
            ("L487–L491", "A design decision is reconsidered when it does not improve usability."),
            ("L487–L491", "A design decision is reconsidered when it does not improve long-term scalability."),
        ],
        "type": "Process", "modality": "SHOULD", "classification": "REC",
    },
    "REQ-008.04": {
        "items": [
            ("L493", "The platform avoids clutter."),
            ("L493", "Every screen has a clear purpose."),
        ],
        "type": "Quality", "modality": "SHOULD", "classification": "REC", "layer": "Frontend handoff",
    },
    "REQ-008.07": {
        "items": [
            ("L499; L505", "The product design is mobile-first."),
            ("L499; L505", "The product design is responsive."),
        ],
        "type": "Quality", "modality": "MUST", "classification": "CD", "layer": "Frontend handoff",
    },
    "REQ-011.19": {
        "items": [
            ("L651", "The wallet is transparent about financial states."),
            ("L651", "The wallet is transparent about financial history."),
        ],
        "type": "Quality", "modality": "SHOULD", "classification": "CBR",
    },
    "REQ-002.41": {
        "items": [
            ("L231–L233", "The Product Blueprint makes no unstated assumptions."),
            ("L231–L233", "The Product Blueprint documents everything in scope."),
        ],
        "type": "Deliverable", "modality": "MUST", "classification": "CD", "target": "Pre-implementation deliverable",
    },
    "REQ-016.01": {
        "items": [
            ("L811–L813", "The withdrawal experience feels professional."),
            ("L811–L813", "The withdrawal experience feels transparent."),
        ],
        "type": "Quality", "modality": "SHOULD", "classification": "REC", "layer": "Frontend handoff",
    },
    "REQ-019.02": {
        "items": item_specs("L911", [(913, "search-engine optimization"), (915, "organic traffic"), (917, "trust building"), (919, "user education"), (921, "content marketing")], "The professional blog supports {item}."),
        "type": "Functional", "modality": "MUST", "classification": "CD",
    },
    "REQ-035.02": {
        "items": item_specs("L1519", [(1521, "free-tier friendliness"), (1523, "scalability"), (1525, "security"), (1527, "maintainability"), (1529, "performance"), (1531, "developer productivity"), (1533, "long-term sustainability")], "The backend technology evaluation assesses {item}."),
        "type": "Deliverable", "modality": "MUST", "classification": "CD", "target": "Pre-implementation deliverable",
    },
    "REQ-031.07": {
        "items": [
            ("L1403", "The email-delivery recommendation evaluates reliability."),
            ("L1403", "The email-delivery recommendation evaluates scalability."),
            ("L1403", "The email-delivery recommendation evaluates cost."),
            ("L1403", "The email-delivery recommendation evaluates free-tier availability."),
        ],
        "type": "Deliverable", "modality": "SHOULD", "classification": "REC", "target": "Pre-implementation deliverable",
    },
    "REQ-021.08": {
        "items": [
            ("L1013", "The architecture documentation recommends measurable performance targets."),
            ("L1013", "The architecture documentation recommends architecture choices that support its performance targets."),
        ],
        "type": "Deliverable", "modality": "SHOULD", "classification": "REC", "target": "Pre-implementation deliverable",
    },
    "REQ-029.09": {
        "items": [
            ("L1363", "Provider integrations comply with each provider’s published requirements."),
            ("L1363", "Provider integrations comply with each provider’s agreements."),
        ],
        "type": "Quality", "modality": "MUST", "classification": "CD", "layer": "Backend/API",
    },
    "REQ-033.15": {
        "items": [
            ("L1451; L1479", "The security architecture covers logging."),
            ("L1451; L1479", "The security architecture covers monitoring."),
        ],
        "type": "Deliverable", "modality": "MUST", "classification": "CD", "target": "Pre-implementation deliverable",
    },
    "REQ-034.01": {
        "items": [
            ("L1489–L1491", "The database design is normalized."),
            ("L1489–L1491", "The database design is scalable."),
            ("L1489–L1491", "The database design is relational."),
        ],
        "type": "Deliverable", "modality": "SHOULD", "classification": "REC", "target": "Pre-implementation deliverable", "layer": "Database",
    },
    "REQ-035.03": {
        "items": [
            ("L1535", "The backend recommendation compares appropriate technology options."),
            ("L1535", "The backend recommendation recommends the best-fit architecture."),
            ("L1535", "The backend recommendation provides clear reasoning for its recommendation."),
        ],
        "type": "Deliverable", "modality": "MUST", "classification": "CD", "target": "Pre-implementation deliverable", "layer": "Backend/Architecture",
    },
    "REQ-038.01": {
        "items": item_specs("L1647", [(1649, "user trust"), (1651, "simplicity"), (1653, "transparency"), (1655, "security"), (1657, "performance"), (1659, "scalability"), (1661, "maintainability"), (1663, "accessibility"), (1665, "automation"), (1667, "long-term sustainability")], "Every project decision prioritizes {item}."),
        "type": "Process", "modality": "MUST", "classification": "CD",
    },
    "REQ-037.02": {
        "items": [
            ("L1621", "When a safer, more scalable, more maintainable, or more cost-effective approach exists, its trade-offs are documented."),
            ("L1621", "When a safer, more scalable, more maintainable, or more cost-effective approach exists, the improved approach is recommended."),
        ],
        "type": "Process", "modality": "SHOULD", "classification": "REC", "target": "Pre-implementation deliverable",
    },
    "REQ-036.22": {
        "items": [
            ("L1613", "The roadmap is suitable for interactive project-management tools."),
            ("L1613", "Roadmap tasks can be checked off interactively as development progresses."),
        ],
        "type": "Deliverable", "modality": "SHOULD", "classification": "REC", "target": "Pre-implementation deliverable",
    },
    "REQ-046.01": {
        "items": [
            ("L1995–L1999", "Delivery prioritizes long-term platform quality over coding speed."),
            ("L1995–L1999", "Delivery prioritizes long-term platform maintainability over coding speed."),
            ("L1995–L1999", "Delivery prioritizes long-term platform trustworthiness over coding speed."),
        ],
        "type": "Process", "modality": "MUST", "classification": "CD",
    },
    "REQ-046.02": {
        "items": [
            ("L2001", "When a substantially better solution exists, its reasoning is explained before implementation."),
            ("L2001", "When a substantially better solution exists, its trade-offs are outlined before implementation."),
            ("L2001", "When a substantially better solution exists, the improved approach is recommended before implementation."),
        ],
        "type": "Process", "modality": "MUST", "classification": "CD", "target": "Pre-implementation deliverable",
    },
    "REQ-047.08": {
        "items": [
            ("L2047", "The database is designed for long-term scalability."),
            ("L2047", "The database is designed for long-term maintainability."),
            ("L2047", "The database is designed for long-term integrity."),
            ("L2047", "The database is designed for long-term performance."),
        ],
        "type": "Deliverable", "modality": "MUST", "classification": "CD", "target": "Pre-implementation deliverable", "layer": "Database",
    },
    "REQ-048.02": {
        "items": [
            ("L2085", "Primary keys are used consistently."),
            ("L2085", "Foreign keys are used consistently."),
        ],
        "type": "Quality", "modality": "MUST", "classification": "CD", "layer": "Database",
    },
    "REQ-058.28": {
        "items": [
            ("L2585", "API standards are recommended before implementation."),
            ("L2585", "API standards are documented before implementation."),
        ],
        "type": "Deliverable", "modality": "SHOULD", "classification": "REC", "target": "Pre-implementation deliverable", "layer": "Backend/API",
    },
    "REQ-063.04": {
        "items": [
            ("L2803", "Provider integrations comply with each provider’s published requirements."),
            ("L2803", "Provider integrations comply with each provider’s agreements."),
        ],
        "type": "Quality", "modality": "SHOULD", "classification": "REC", "layer": "Backend/API",
    },
    "REQ-065.33": {
        "items": [
            ("L2953", "API observability tools are appropriate to the selected stack."),
            ("L2953", "API observability architecture is appropriate to the selected stack."),
        ],
        "type": "Deliverable", "modality": "SHOULD", "classification": "REC", "target": "Pre-implementation deliverable", "layer": "Backend/API",
    },
    "REQ-045.08": {
        "items": item_specs("L1957; L1959", [(1961, "database backups"), (1963, "configuration backups"), (1965, "file-storage backups"), (1967, "recovery testing"), (1969, "recovery objectives")], "The documented backup and recovery strategy addresses {item}."),
        "type": "Deliverable", "modality": "SHOULD", "classification": "REC", "target": "Pre-implementation deliverable",
    },
    "REQ-045.10": {
        "items": item_specs("L1979", [(1981, "user feedback"), (1983, "support requests"), (1985, "analytics"), (1987, "performance metrics"), (1989, "security findings")], "The continuous-improvement process regularly reviews {item}."),
        "type": "Process", "modality": "MUST", "classification": "CD",
    },
    "REQ-056.02": {
        "items": item_specs("L2393; L2395", [(2397, "user lookups"), (2399, "wallet history"), (2401, "withdrawals"), (2403, "surveys"), (2405, "notifications"), (2407, "audit logs")], "The index strategy evaluates expected access patterns for {item}."),
        "type": "Deliverable", "modality": "SHOULD", "classification": "REC", "target": "Pre-implementation deliverable",
    },
    "REQ-056.05": {
        "items": item_specs("L2415; L2417", [(2419, "future partitioning where needed"), (2421, "historical-record archiving"), (2423, "read-heavy workloads"), (2425, "reporting workloads")], "The database scalability review evaluates {item}."),
        "type": "Deliverable", "modality": "SHOULD", "classification": "REC", "target": "Pre-implementation deliverable",
    },
    "REQ-067.01": {
        "items": item_specs("L2999", [(3001, "professionalism"), (3003, "trust"), (3005, "simplicity"), (3007, "transparency"), (3009, "speed"), (3011, "security"), (3013, "modernity")], "The EarnPearls interface communicates {item}."),
        "type": "Non-functional", "modality": "SHOULD", "classification": "REC", "layer": "Frontend handoff",
    },
    "REQ-067.04": {
        "items": item_specs("L3023–L3027", [(3029, "clean"), (3031, "spacious"), (3033, "elegant"), (3035, "minimal"), (3037, "premium"), (3039, "responsive"), (3041, "fast"), (3043, "mobile-first")], "The SaaS design language is {item}."),
        "type": "Non-functional", "modality": "SHOULD", "classification": "REC", "layer": "Frontend handoff",
    },
    "REQ-067.05": {
        "items": item_specs("L3045", [(3047, "clutter"), (3049, "pervasive popups"), (3051, "distracting animations"), (3053, "heavy gradients"), (3055, "flashy colors"), (3057, "confusing layouts")], "The interface avoids {item}."),
        "type": "Quality", "modality": "MUST", "classification": "CD", "layer": "Frontend handoff",
    },
    "REQ-067.06": {
        "items": item_specs("L3063", [(3065, "spacing"), (3067, "typography"), (3069, "buttons"), (3071, "icons"), (3073, "forms"), (3075, "colors"), (3077, "cards"), (3079, "navigation")], "Every page uses consistent {item}."),
        "type": "Quality", "modality": "SHOULD", "classification": "REC", "layer": "Frontend handoff",
    },
    "REQ-068.02": {
        "items": item_specs("L3095", [(3097, "reward"), (3099, "value"), (3101, "growth"), (3103, "premium quality"), (3105, "trust")], "The logo communicates {item}."),
        "type": "Identity", "modality": "SHOULD", "classification": "REC", "layer": "Frontend handoff",
    },
    "REQ-068.01": {
        "items": [
            ("L3085–L3089", "The product brand name is EarnPearls."),
            ("L3085; L3091–L3093", "The product tagline is “Your Time. Your Rewards.”"),
        ],
        "type": "Identity", "modality": "MUST", "classification": "CD", "layer": "Frontend handoff",
    },
    "REQ-068.07": {
        "items": [
            ("L3151", "Typography uses modern fonts."),
            ("L3151", "Typography uses readable fonts."),
        ]
        + item_specs("L3153", [(3155, "readability"), (3157, "accessibility"), (3159, "professional appearance"), (3161, "mobile readability")], "Typography prioritizes {item}."),
        "type": "Quality", "modality": "MUST", "classification": "CD", "layer": "Frontend handoff",
    },
    "REQ-068.08": {
        "items": [
            ("L3163", "Typography defines a clear hierarchy for headings."),
            ("L3163", "Typography defines a clear hierarchy for body text."),
            ("L3163", "Typography defines a clear hierarchy for labels."),
            ("L3163", "Typography defines a clear hierarchy for helper text."),
        ],
        "type": "Quality", "modality": "MUST", "classification": "CD", "layer": "Frontend handoff",
    },
    "REQ-068.09": {
        "items": [
            ("L3167–L3169", "The interface uses a consistent spacing system."),
            ("L3167; L3171", "Interface components align cleanly."),
        ],
        "type": "Quality", "modality": "SHOULD", "classification": "REC", "layer": "Frontend handoff",
    },
    "REQ-068.10": {
        "items": item_specs("L3173", [(3175, "mobile"), (3177, "tablet"), (3179, "laptop"), (3181, "desktop"), (3183, "large-desktop")], "Responsive breakpoint planning includes a {item} range."),
        "type": "Deliverable", "modality": "SHOULD", "classification": "REC", "layer": "Frontend handoff", "target": "Pre-implementation deliverable",
    },
    "REQ-068.11": {
        "items": item_specs("L3189", [(3191, "simple"), (3193, "modern"), (3195, "consistent"), (3197, "recognizable")], "Icons are {item}."),
        "type": "Quality", "modality": "SHOULD", "classification": "REC", "layer": "Frontend handoff",
    },
    "REQ-069.01": {
        "items": item_specs("L3205", [(3207, "primary"), (3209, "secondary"), (3211, "outline"), (3213, "danger"), (3215, "text"), (3217, "disabled"), (3219, "loading")], "The button system standardizes a {item} variant or state."),
        "type": "Functional", "modality": "MUST", "classification": "CBR", "layer": "Frontend handoff",
    },
    "REQ-069.02": {
        "items": item_specs("L3221", [(3223, "hover"), (3225, "focus"), (3227, "active"), (3229, "disabled"), (3231, "loading")], "Every button defines a {item} state."),
        "type": "Functional", "modality": "SHOULD", "classification": "CBR", "layer": "Frontend handoff",
    },
    "REQ-069.10": {
        "items": item_specs("L3259", [(3261, "padding"), (3263, "borders"), (3265, "corner radius"), (3267, "shadow"), (3269, "hover behavior")], "Cards use a consistent {item} rule."),
        "type": "Quality", "modality": "SHOULD", "classification": "CBR", "layer": "Frontend handoff",
    },
    "REQ-069.11": {
        "items": item_specs("L3271", [(3273, "survey"), (3275, "wallet"), (3277, "transaction"), (3279, "blog"), (3281, "statistics"), (3283, "leaderboard"), (3285, "admin-widget")], "The shared card system supports a {item} context."),
        "type": "Functional", "modality": "SHOULD", "classification": "CBR", "layer": "Frontend handoff",
    },
    "REQ-070.23": {
        "items": item_specs("L3369", [(3371, "rank"), (3373, "display name"), (3375, "points earned"), (3377, "surveys completed")], "The weekly leaderboard displays {item}."),
        "type": "Functional", "modality": "SHOULD", "classification": "CBR", "layer": "Frontend handoff",
    },
    "REQ-072.13": {
        "items": item_specs("L3509", [(3511, "401"), (3513, "403"), (3515, "404"), (3517, "429"), (3519, "500"), (3521, "maintenance"), (3523, "offline")], "A professional {item} error or service-state page exists."),
        "type": "Functional", "modality": "MUST", "classification": "CBR", "layer": "Frontend handoff",
    },
    "REQ-072.08": {
        "items": [
            ("L3473–L3475", "Interface animations are subtle."),
            ("L3473; L3489", "The interface avoids excessive animation."),
        ],
        "type": "Quality", "modality": "MUST", "classification": "CD", "layer": "Frontend handoff",
    },
    "REQ-074.02": {
        "items": item_specs("L3573", [(3575, "trust"), (3577, "content"), (3579, "community"), (3581, "organic search"), (3583, "social-media presence"), (3585, "user retention"), (3587, "referral growth"), (3589, "brand authority")], "The long-term growth strategy is built around {item}."),
        "type": "Deliverable", "modality": "SHOULD", "classification": "REC", "target": "Pre-implementation deliverable",
    },
    "REQ-074.04": {
        "items": item_specs("L3601", [(3603, "respect for user time"), (3605, "transparency"), (3607, "fair rewards"), (3609, "a simple experience"), (3611, "reliable withdrawals"), (3613, "user empowerment")], "Brand messaging emphasizes {item}."),
        "type": "Identity", "modality": "SHOULD", "classification": "REC",
    },
    "REQ-074.07": {
        "items": item_specs("L3629", [(3631, "United States"), (3633, "United Kingdom"), (3635, "Canada"), (3637, "Australia"), (3639, "Ireland"), (3641, "Germany"), (3643, "selected European markets"), (3647, "Saudi Arabia"), (3649, "UAE"), (3651, "Qatar"), (3653, "Oman"), (3655, "Bahrain")], "The target-audience plan includes {item}."),
        "type": "Deliverable", "modality": "SHOULD", "classification": "REC", "target": "Pre-implementation deliverable",
    },
    "REQ-074.08": {
        "items": item_specs("L3657", [(3659, "country"), (3661, "culture"), (3663, "language behavior"), (3665, "internet habits"), (3667, "reward preferences")], "Marketing campaign adaptation considers {item}."),
        "type": "Deliverable", "modality": "SHOULD", "classification": "REC", "target": "Pre-implementation deliverable",
    },
    "REQ-075.19": {
        "items": [
            ("L3727; L3729; L3731", "The content calendar includes a Survey Education category."),
            ("L3727; L3729; L3745", "The content calendar includes a Rewards Education category."),
            ("L3727; L3729; L3759", "The content calendar includes a Trust Content category."),
            ("L3727; L3729; L3773–L3775", "The content calendar includes search-based content targeting user questions."),
        ],
        "type": "Deliverable", "modality": "SHOULD", "classification": "REC", "target": "Pre-implementation deliverable",
    },
    "REQ-076.02": {
        "items": item_specs("L3795; L3797–L3799", [(3801, "branding"), (3803, "video categories"), (3805, "an upload schedule"), (3807, "an SEO strategy"), (3809, "a thumbnail strategy"), (3811, "a retention strategy")], "The YouTube channel strategy includes {item}."),
        "type": "Deliverable", "modality": "SHOULD", "classification": "REC", "target": "Pre-implementation deliverable",
    },
    "REQ-076.03": {
        "items": [
            ("L3791–L3793; L3815; L3817", "YouTube content planning includes educational videos."),
            ("L3791–L3793; L3815; L3827", "YouTube content planning includes platform updates."),
            ("L3791–L3793; L3815; L3837", "YouTube content planning includes trust-building content."),
        ],
        "type": "Deliverable", "modality": "SHOULD", "classification": "REC", "target": "Pre-implementation deliverable",
    },
    "REQ-076.04": {
        "items": item_specs("L3849; L3851", [(3853, "TikTok"), (3855, "Instagram Reels"), (3857, "YouTube Shorts"), (3859, "Facebook Reels")], "The short-form video strategy covers {item}."),
        "type": "Deliverable", "modality": "SHOULD", "classification": "REC", "target": "Pre-implementation deliverable",
    },
    "REQ-076.05": {
        "items": item_specs("L3861", [(3863, "quick tips"), (3865, "reward education"), (3867, "platform features"), (3869, "user guidance")], "Short-form content includes {item}."),
        "type": "Deliverable", "modality": "SHOULD", "classification": "REC", "target": "Pre-implementation deliverable",
    },
    "REQ-076.06": {
        "items": [
            ("L3871", "Short-form video optimizes for awareness."),
            ("L3871", "Short-form video optimizes for trust."),
        ],
        "type": "Deliverable", "modality": "MUST", "classification": "CD", "target": "Pre-implementation deliverable",
    },
    "REQ-076.07": {
        "items": [
            ("L3875–L3881", "YouTube is an initial social priority for long-term value."),
            ("L3875; L3883–L3885", "Instagram is an initial social priority for brand awareness."),
            ("L3875; L3883–L3885", "Instagram is an initial social priority for community development."),
            ("L3875; L3887–L3889", "TikTok is an initial social priority for discovery."),
            ("L3875; L3887–L3889", "TikTok is an initial social priority for reach."),
            ("L3875; L3891–L3893", "Facebook is an initial social priority for community building."),
            ("L3895–L3899", "LinkedIn is not a launch priority."),
        ],
        "type": "Deliverable", "modality": "SHOULD", "classification": "REC", "target": "Pre-implementation deliverable",
    },
    "REQ-077.17": {
        "items": item_specs("L3971", [(3973, "content clusters"), (3975, "pillar pages"), (3977, "supporting articles"), (3979, "an internal-linking strategy")], "The blog SEO plan includes {item}."),
        "type": "Deliverable", "modality": "SHOULD", "classification": "REC", "target": "Pre-implementation deliverable",
    },
    "REQ-080.01": {
        "items": item_specs("L4149", [(4151, "social presence"), (4153, "user feedback"), (4155, "transparency"), (4157, "updates"), (4159, "educational resources")], "Community trust is built through {item}."),
        "type": "Deliverable", "modality": "MUST", "classification": "CD", "target": "Pre-implementation deliverable",
    },
    "REQ-081.01": {
        "items": [
            ("L4199–L4201", "The infrastructure approach is startup-friendly."),
            ("L4199–L4201", "The infrastructure approach is enterprise-ready."),
        ],
        "type": "Non-functional", "modality": "MUST", "classification": "CD", "target": "Pre-implementation deliverable", "layer": "DevOps/Architecture",
    },
    "REQ-081.02": {
        "items": [
            ("L4203", "Initial infrastructure is cost-efficient."),
            ("L4203", "Initial infrastructure has a clear migration path toward larger enterprise infrastructure as usage grows."),
        ],
        "type": "Non-functional", "modality": "SHOULD", "classification": "REC", "target": "Pre-implementation deliverable", "layer": "DevOps/Architecture",
    },
    "REQ-081.04": {
        "items": item_specs("L4207", [(4209, "reliability"), (4211, "security"), (4213, "performance"), (4215, "low operational cost"), (4217, "scalability"), (4219, "easy maintenance"), (4221, "future migration capability")], "Infrastructure decisions prioritize {item}."),
        "type": "Deliverable", "modality": "SHOULD", "classification": "REC", "target": "Pre-implementation deliverable",
    },
    "REQ-081.06": {
        "items": item_specs("L4231", [(4233, "free-tier availability"), (4235, "resource limits"), (4237, "scalability"), (4239, "reliability"), (4241, "security"), (4243, "developer experience"), (4245, "documentation quality"), (4247, "long-term cost"), (4249, "migration difficulty")], "The infrastructure evaluation assesses {item}."),
        "type": "Deliverable", "modality": "MUST", "classification": "CD", "target": "Pre-implementation deliverable",
    },
    "REQ-082.01": {
        "items": item_specs("L4287", [(4289, "frontend"), (4291, "backend services"), (4293, "database"), (4295, "storage"), (4297, "email delivery"), (4299, "background jobs"), (4301, "monitoring"), (4303, "third-party integrations")], "Cloud architecture separates the {item} component so it can scale independently."),
        "type": "Non-functional", "modality": "SHOULD", "classification": "REC", "target": "Pre-implementation deliverable",
    },
    "REQ-082.03": {
        "items": item_specs("L4311", [(4313, "performance"), (4315, "security"), (4317, "cost"), (4319, "developer availability"), (4321, "maintenance requirements")], "The backend option evaluation assesses {item}."),
        "type": "Deliverable", "modality": "MUST", "classification": "CD", "target": "Pre-implementation deliverable",
    },
    "REQ-083.01": {
        "items": item_specs("L4345", [(4347, "PostgreSQL"), (4349, "MySQL"), (4351, "MariaDB"), (4353, "serverless databases"), (4355, "managed database services")], "The database infrastructure evaluation assesses {item}."),
        "type": "Deliverable", "modality": "SHOULD", "classification": "REC", "target": "Pre-implementation deliverable",
    },
    "REQ-083.02": {
        "items": item_specs("L4357", [(4359, "free-tier limits"), (4361, "backups"), (4363, "performance"), (4365, "scaling options"), (4367, "security"), (4369, "migration possibilities")], "The database infrastructure evaluation considers {item}."),
        "type": "Deliverable", "modality": "SHOULD", "classification": "REC", "target": "Pre-implementation deliverable",
    },
    "REQ-083.09": {
        "items": [
            ("L4389–L4391", "The storage strategy evaluates object storage."),
            ("L4389; L4393", "The storage strategy evaluates CDN integration."),
            ("L4389; L4395", "The storage strategy evaluates cost optimization."),
        ],
        "type": "Deliverable", "modality": "SHOULD", "classification": "REC", "target": "Pre-implementation deliverable", "layer": "DevOps/Architecture",
    },
    "REQ-084.02": {
        "items": item_specs("L4403", [(4405, "free limits"), (4407, "deliverability"), (4409, "API quality"), (4411, "reliability"), (4413, "scalability")], "The email-provider evaluation assesses {item}."),
        "type": "Deliverable", "modality": "MUST", "classification": "CD", "target": "Pre-implementation deliverable",
    },
    "REQ-084.14": {
        "items": item_specs("L4445", [(4447, "Email OTP"), (4449, "SMS OTP"), (4451, "third-party verification services")], "The OTP recommendation evaluates {item}.")
        + item_specs("L4445; L4453", [(4455, "cost"), (4457, "reliability"), (4459, "target-country coverage")], "The OTP recommendation assesses {item}."),
        "type": "Deliverable", "modality": "SHOULD", "classification": "REC", "target": "Pre-implementation deliverable",
    },
    "REQ-085.06": {
        "items": [
            ("L4497–L4501", "The project has a separate development environment for active coding."),
            ("L4497; L4503–L4505", "The project has a separate testing/staging environment for quality assurance."),
            ("L4497; L4507–L4509", "The project has a separate production environment for real users."),
        ],
        "type": "Process", "modality": "MUST", "classification": "CD",
    },
    "REQ-087.20": {
        "items": item_specs("L4613", [(4615, "errors"), (4617, "security events"), (4619, "user actions"), (4621, "integration failures")], "Logs support investigation of {item}."),
        "type": "Process", "modality": "SHOULD", "classification": "REC",
    },
    "REQ-089.01": {
        "items": item_specs("L4695", [(4697, "free-tier utilization"), (4699, "avoidance of unnecessary services"), (4701, "efficient resource usage"), (4703, "expense monitoring")], "Infrastructure cost optimization continuously considers {item}."),
        "type": "Deliverable", "modality": "SHOULD", "classification": "REC", "target": "Pre-implementation deliverable",
    },
    "REQ-090.01": {
        "items": [
            ("L4735–L4737", "Infrastructure is designed for serious global-platform operation."),
            ("L4735–L4737", "Infrastructure design respects startup realities."),
        ],
        "type": "Non-functional", "modality": "MUST", "classification": "CD", "target": "Pre-implementation deliverable", "layer": "DevOps/Architecture",
    },
    "REQ-090.04": {
        "items": [
            ("L4743", "The infrastructure foundation can start cheaply."),
            ("L4743", "The infrastructure foundation has a professional growth path."),
        ],
        "type": "Non-functional", "modality": "MUST", "classification": "CD", "target": "Pre-implementation deliverable", "layer": "DevOps/Architecture",
    },
    "REQ-091.03": {
        "items": [
            ("L4787–L4791", "Before implementation, the agent understands the project."),
            ("L4787–L4791", "Before implementation, the agent analyzes the project."),
            ("L4787–L4791", "Before implementation, the agent challenges the project."),
            ("L4787–L4791", "Before implementation, the agent improves the project."),
            ("L4787–L4791", "Before implementation, the agent documents the project."),
        ],
        "type": "Process", "modality": "MUST", "classification": "CD", "target": "Pre-implementation deliverable",
    },
    "REQ-092.25": {
        "items": [
            ("L4867–L4873", "Architecture is self-reviewed before implementation."),
            ("L4867–L4873", "Architecture weaknesses are identified before implementation."),
            ("L4867–L4873", "Architecture improvements are made before implementation."),
        ],
        "type": "Process", "modality": "MUST", "classification": "CD", "target": "Pre-implementation deliverable",
    },
    "REQ-092.31": {
        "items": [
            ("L4891", "The UI/UX design makes the product feel premium."),
            ("L4891", "The UI/UX design makes the product feel trustworthy."),
        ],
        "type": "Quality", "modality": "MUST", "classification": "CD", "target": "Pre-implementation deliverable", "layer": "Frontend handoff",
    },
    "REQ-093.12": {
        "items": item_specs("L4939; L4941", [(4943, "project structure"), (4945, "authentication foundation"), (4947, "database foundation"), (4949, "core configuration"), (4951, "security foundation")], "The Foundation phase builds {item}."),
        "type": "Process", "modality": "MUST", "classification": "CD", "target": "V1",
    },
    "REQ-093.13": {
        "items": item_specs("L4955; L4957", [(4959, "registration"), (4961, "email verification"), (4963, "login"), (4965, "the user dashboard"), (4967, "profile management"), (4969, "the wallet foundation")], "The User Platform phase builds {item}."),
        "type": "Process", "modality": "MUST", "classification": "CD", "target": "V1",
    },
    "REQ-093.14": {
        "items": item_specs("L4973; L4975", [(4977, "the points system"), (4979, "USD conversion"), (4981, "wallet transactions"), (4983, "balance maturity"), (4985, "reward history")], "The Rewards Engine phase builds {item}."),
        "type": "Process", "modality": "MUST", "classification": "CD", "target": "V1",
    },
    "REQ-093.15": {
        "items": item_specs("L4989; L4991", [(4993, "the survey marketplace"), (4995, "the provider-integration framework"), (4997, "survey tracking"), (4999, "reward synchronization")], "The Survey System phase builds {item}."),
        "type": "Process", "modality": "MUST", "classification": "CD", "target": "V1",
    },
    "REQ-093.16": {
        "items": item_specs("L5003; L5005", [(5007, "withdrawal requests"), (5009, "payment methods"), (5011, "the processing workflow"), (5013, "history tracking")], "The Withdrawal System phase builds {item}."),
        "type": "Process", "modality": "MUST", "classification": "CD", "target": "V1",
    },
    "REQ-093.17": {
        "items": item_specs("L5017; L5019", [(5021, "the Super Admin Panel"), (5023, "user management"), (5025, "Limit Templates"), (5027, "permissions"), (5029, "settings"), (5031, "analytics"), (5033, "audit logs")], "The Admin ERP phase builds {item}."),
        "type": "Process", "modality": "MUST", "classification": "CD", "target": "V1",
    },
    "REQ-093.18": {
        "items": item_specs("L5037; L5039", [(5041, "the blog"), (5043, "SEO features"), (5045, "content management"), (5047, "marketing integrations"), (5049, "analytics")], "The Growth System phase builds {item}."),
        "type": "Process", "modality": "MUST", "classification": "CD", "target": "V1",
    },
    "REQ-093.19": {
        "items": item_specs("L5053; L5055", [(5057, "performance"), (5059, "security"), (5061, "user experience"), (5063, "scalability")], "The Optimization phase improves {item}."),
        "type": "Process", "modality": "MUST", "classification": "CD", "target": "V1",
    },
    "REQ-091.01": {
        "items": item_specs("L4763", [(4765, "Product Company"), (4767, "Software Development Team"), (4769, "Architecture Team"), (4771, "Quality Assurance Team"), (4773, "Security Team"), (4775, "Operations Team"), (4777, "Marketing Strategy Team"), (4779, "Documentation Team")], "The delivery agent operates with the responsibilities of the {item}."),
        "type": "Process", "modality": "MUST", "classification": "CD", "target": "Pre-implementation deliverable",
    },
}


def parse_ranges(locator: str) -> list[tuple[int, int]]:
    output = []
    for token in locator.split(";"):
        match = re.fullmatch(r"\s*L(\d+)(?:[–-]L?(\d+))?\s*", token)
        if not match:
            raise ValueError(locator)
        output.append((int(match.group(1)), int(match.group(2) or match.group(1))))
    return output


def first_line(locator: str) -> int:
    return parse_ranges(locator)[0][0]


def source_wording(lines: list[str], locator: str) -> str:
    chunks = []
    for start, end in parse_ranges(locator):
        chunks.append(" / ".join(line for line in lines[start - 1 : end] if line.strip()))
    return " || ".join(chunks)


def load_rows(path: Path) -> list[dict[str, str]]:
    with path.open(encoding="utf-8", newline="") as handle:
        return list(csv.DictReader(handle))


def write_rows(path: Path, fields: list[str], rows: list[dict[str, str]]) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    with path.open("w", encoding="utf-8", newline="") as handle:
        writer = csv.DictWriter(
            handle,
            fieldnames=fields,
            extrasaction="ignore",
            quoting=csv.QUOTE_ALL,
            lineterminator="\n",
        )
        writer.writeheader()
        writer.writerows(rows)


def previous_nonblank(lines: list[str], line_number: int) -> str:
    for index in range(line_number - 2, -1, -1):
        if lines[index].strip():
            return lines[index].strip()
    return ""


def is_heading(lines: list[str], line_number: int) -> bool:
    value = lines[line_number - 1].strip()
    if not value or value in {"README", "USD", "UAE", "CPU"}:
        return False
    if value.startswith((
        "MASTER AI CONTEXT",
        "EARNPEARLS MASTER PRODUCT CONSTITUTION",
        "PART ",
        "END OF EARNPEARLS",
    )):
        return False
    letters = "".join(char for char in value.replace("APIs", "API") if char.isalpha())
    uppercase_heading = len(letters) >= 4 and letters == letters.upper()
    after_separator = previous_nonblank(lines, line_number) in {"\\---", "---"}
    commentary = value.startswith((
        "Excellent",
        "Perfect",
        "Next",
        "This completes",
        "This will be",
        "One recommendation",
        "Here's",
        "At this point",
    ))
    numbered_phase = re.fullmatch(r"Phase \d+", value) is not None
    return uppercase_heading or numbered_phase or (after_separator and not commentary)


def heading_map(lines: list[str]) -> tuple[dict[int, tuple[int, str]], list[int]]:
    headings = [(number, lines[number - 1].strip()) for number in range(1, len(lines) + 1) if is_heading(lines, number)]
    active: dict[int, tuple[int, str]] = {}
    current = headings[0]
    cursor = 0
    for number in range(1, len(lines) + 1):
        if cursor < len(headings) and headings[cursor][0] == number:
            current = headings[cursor]
            cursor += 1
        active[number] = current
    return active, [line for line, _ in headings]


def phase_docs(part: str, section: str, layer: str) -> str:
    if part == "Part 1":
        if section in {"BUSINESS SUMMARY", "TARGET COUNTRIES", "PROJECT TITLE"}:
            return "EP-P0-02; EP-P0-04"
        if section in {"USER REGISTRATION", "USER ACCOUNT STATUS"}:
            return "EP-P0-04; EP-P0-07; EP-P0-08; EP-P0-09; EP-P0-11"
        if section == "IMPORTANT WORKFLOW":
            return "EP-P0-02; EP-P0-03; EP-P0-04; EP-P0-05; EP-P0-06; EP-P0-13"
        return "EP-P0-02; EP-P0-04; EP-P0-06; EP-P0-13"
    if part == "Part 2":
        docs = ["EP-P0-04", "EP-P0-05"]
        if section in {"WALLET SYSTEM", "BALANCE MATURITY SYSTEM", "WITHDRAWAL SYSTEM"}:
            docs.extend(["EP-P0-08", "EP-P0-09"])
        elif "Backend" in layer or section in {"SURVEY EXPERIENCE", "NOTIFICATION CENTER", "SUPPORT CENTER", "BLOG SYSTEM"}:
            docs.append("EP-P0-09")
        return "; ".join(dict.fromkeys(docs))
    if part == "Part 3":
        mapping = {
            "PROVIDER INTEGRATION FRAMEWORK": "EP-P0-06; EP-P0-09; EP-P0-10",
            "API MANAGEMENT": "EP-P0-06; EP-P0-09",
            "EMAIL SYSTEM": "EP-P0-06; EP-P0-09; EP-P0-12",
            "AUDIT LOGGING": "EP-P0-08; EP-P0-11",
            "SECURITY": "EP-P0-11",
            "DATABASE ARCHITECTURE": "EP-P0-08",
            "BACKEND ARCHITECTURE": "EP-P0-06",
            "FRONTEND ARCHITECTURE": "EP-P0-06; EP-P0-04; EP-P0-05",
            "PROJECT DOCUMENTATION": "EP-P0-13",
            "INTERACTIVE DEVELOPMENT ROADMAP": "EP-P0-13",
            "QUALITY STANDARD": "EP-P0-13",
        }
        return mapping.get(section, "EP-P0-04; EP-P0-06; EP-P0-07; EP-P0-08; EP-P0-09")
    if part == "Part 4":
        if section in {"ACCESSIBILITY", "USER EXPERIENCE STANDARDS"}:
            return "EP-P0-04; EP-P0-05; EP-P0-11"
        if section in {"BACKUP & RECOVERY", "BACKGROUND PROCESSING", "RELEASE MANAGEMENT"}:
            return "EP-P0-12; EP-P0-13"
        return "EP-P0-06; EP-P0-11; EP-P0-12; EP-P0-13"
    if part == "Part 5":
        return "EP-P0-08"
    if part == "Part 6":
        docs = ["EP-P0-09"]
        if section in {"PROVIDER INTEGRATION LAYER", "WEBHOOK ARCHITECTURE"}:
            docs.append("EP-P0-10")
        if section == "API SECURITY":
            docs.append("EP-P0-11")
        return "; ".join(docs)
    if part == "Part 7":
        return "EP-P0-04; EP-P0-05"
    if part == "Part 8":
        return "EP-P0-02; EP-P0-03; EP-P0-04; EP-P0-05; EP-P0-13"
    if part == "Part 9":
        if section == "SECURITY OPERATIONS":
            return "EP-P0-11; EP-P0-12"
        return "EP-P0-12"
    if part == "Part 10":
        if section in {"SUPER ADMIN PRINCIPLE"}:
            return "EP-P0-04; EP-P0-06; EP-P0-07; EP-P0-08; EP-P0-09; EP-P0-11"
        if section in {"SECURITY PRINCIPLE"}:
            return "EP-P0-11"
        if section in {"DOCUMENTATION REQUIREMENTS", "DEVELOPMENT WORKFLOW"} or section.startswith("PHASE "):
            return "EP-P0-13"
        return "EP-P0-02; EP-P0-04; EP-P0-06; EP-P0-13"
    raise ValueError(part)


def acceptance(row: dict[str, str]) -> str:
    summary = row["source_summary"].rstrip(".")
    rid = row["requirement_id"]
    locator = row["verified_exact_line_range"]
    docs = row["related_phase_0_document"]
    req_type = row["requirement_type"]
    layer = row["responsible_layer"]
    if req_type == "Deliverable":
        return (
            f"PASS when {docs} contains a separately reviewable section that demonstrates “{summary}”, "
            f"cites {locator}, and records reviewer approval for {rid}; FAIL if the section, citation, or approval is missing."
        )
    if "Frontend" in layer:
        return (
            f"PASS when the approved screen/component specification and an automated UI test demonstrate “{summary}” "
            f"in every applicable responsive and interaction state for {rid}; FAIL if the behavior is absent, mislabeled, "
            "keyboard-inaccessible, or visible in a prohibited state."
        )
    if "API" in layer or req_type == "Functional" and "API" in row["exact_constitution_section"]:
        return (
            f"PASS when a versioned contract test linked to {rid} demonstrates “{summary}” on the authorized path and "
            "rejects an unauthorized or invalid path with the documented error; FAIL on any unmet assertion."
        )
    if "Database" in layer:
        return (
            f"PASS when migration/schema inspection and an automated integrity test linked to {rid} demonstrate "
            f"“{summary}” without direct data corruption or orphaned state; FAIL if the schema or test evidence is absent."
        )
    if req_type == "Quality" or "Security" in layer:
        return (
            f"PASS when an approved control or measurable threshold for “{summary}” is documented, a positive and "
            f"negative-path test linked to {rid} passes, and evidence is retained; FAIL if the control, threshold, or evidence is missing."
        )
    if req_type == "Non-functional":
        return (
            f"PASS when {docs} defines an owner-approved measurable standard for “{summary}” and recorded review or "
            f"measurement evidence for {rid} meets it; FAIL when the standard is undefined or the measured result is below it."
        )
    if req_type == "Process":
        return (
            f"PASS when a dated audit record linked to {rid} identifies the responsible reviewer, evidence reviewed, "
            f"and outcome proving “{summary}”; FAIL if the gate is bypassed or the audit record is incomplete."
        )
    return (
        f"PASS when an automated positive-path test linked to {rid} demonstrates “{summary}” and an applicable "
        "negative/disabled-path test prevents the contrary behavior; FAIL on any unmet assertion."
    )


def evidence(row: dict[str, str]) -> str:
    req_type = row["requirement_type"]
    if req_type == "Deliverable":
        return "Versioned document section, exact source citation, review checklist, and approval record."
    if req_type == "Process":
        return "Dated gate/audit record naming reviewer, inputs, outcome, and approval state."
    if req_type == "Quality" or "Security" in row["responsible_layer"]:
        return "Approved control or threshold plus positive, negative-path, and retained review evidence."
    if "Database" in row["responsible_layer"]:
        return "Versioned migration/schema evidence plus automated integrity-test result."
    if "API" in row["responsible_layer"]:
        return "Versioned API contract plus passing authorized, invalid, and unauthorized-path tests."
    if "Frontend" in row["responsible_layer"]:
        return "Approved screen/component specification plus responsive, keyboard, accessibility, and state-test evidence."
    return "Linked automated acceptance-test result and relevant audit/event evidence."


def make_replacement(
    base: dict[str, str],
    locator: str,
    summary: str,
    modality: str,
    req_type: str,
    target: str,
    classification: str,
    predecessor: str,
    layer: str | None = None,
) -> dict[str, str]:
    row = deepcopy(base)
    row.update({
        "verified_exact_line_range": locator,
        "source_summary": summary,
        "source_modality": modality,
        "requirement_type": req_type,
        "delivery_target": target,
        "classification": classification,
        "predecessor_requirement_id": predecessor,
    })
    if layer:
        row["responsible_layer"] = layer
    return row


def replacement_rows(rows_by_id: dict[str, dict[str, str]]) -> list[dict[str, str]]:
    output: list[dict[str, str]] = []
    output.extend([
        make_replacement(rows_by_id["REQ-001.04"], "L107", "Version 1.0 remains intentionally focused.", "MUST", "Non-functional", "V1", "CD", "—", "Shared governance"),
        make_replacement(rows_by_id["REQ-001.05"], "L123", "Capabilities outside the focused V1 scope are designed for future expansion.", "SHOULD", "Non-functional", "Future", "FRR", "REQ-001.05", "Architecture"),
        make_replacement(rows_by_id["REQ-002.08"], "L149; L151", "Phase 2 produces a complete Business Blueprint.", "MUST", "Deliverable", "Pre-implementation deliverable", "CD", "REQ-002.08"),
        make_replacement(rows_by_id["REQ-002.09"], "L153", "The Business Blueprint targets a minimum of approximately 100 pages.", "MUST", "Deliverable", "Pre-implementation deliverable", "CD", "REQ-002.09"),
        make_replacement(rows_by_id["REQ-002.09"], "L155", "The Business Blueprint has enough operational depth for a new company to operate from it.", "SHOULD", "Deliverable", "Pre-implementation deliverable", "CD", "REQ-002.09"),
        make_replacement(rows_by_id["REQ-004.11"], "L397", "The architecture keeps future multilingual support technically possible.", "SHOULD", "Non-functional", "Future", "FRR", "REQ-004.11", "Architecture"),
        make_replacement(rows_by_id["REQ-004.11"], "L397", "Multilingual support is not enabled in Version 1.", "MUST", "Functional", "V1", "CBR", "REQ-004.11", "Shared"),
        make_replacement(rows_by_id["REQ-007.05"], "L469", "The Super Admin can create multiple reusable Limit Templates.", "MUST", "Functional", "V1", "CBR", "REQ-007.05", "Backend/Admin ERP"),
        make_replacement(rows_by_id["REQ-007.06"], "L469", "Each Limit Template has configurable permissions.", "MUST", "Functional", "V1", "CBR", "REQ-007.06", "Backend/Admin ERP"),
        make_replacement(rows_by_id["REQ-007.11"], "L469", "A module disabled by a Limit Template does not appear in the interface.", "SHOULD", "Functional", "V1", "CBR", "REQ-007.11", "Frontend handoff"),
        make_replacement(rows_by_id["REQ-007.12"], "L469", "Direct URL access to a module disabled by a Limit Template is denied with an appropriate authorization response.", "SHOULD", "Quality", "V1", "CD", "REQ-007.12", "Security/Backend"),
        make_replacement(rows_by_id["REQ-010.01"], "L569", "The dashboard serves as the central user workspace of the platform.", "SHOULD", "Non-functional", "V1", "REC", "—", "Frontend handoff"),
        make_replacement(rows_by_id["REQ-041.01"], "L1809", "Accessibility design supports broad usability.", "MUST", "Quality", "V1", "CD", "—", "Frontend handoff"),
        make_replacement(rows_by_id["REQ-046.01"], "L1633", "The EarnPearls Master Product Constitution is the permanent project governance source followed by AI agents, developers, and future contributors.", "MUST", "Process", "Pre-implementation deliverable", "CD", "—", "Shared governance"),
    ])
    for row in output:
        if row["verified_exact_line_range"] == "L1633":
            row["exact_constitution_part"] = "Part 3"
    return output


def split_rows(rows_by_id: dict[str, dict[str, str]]) -> list[dict[str, str]]:
    output: list[dict[str, str]] = []
    for predecessor, definition in SPLIT_DEFINITIONS.items():
        base = rows_by_id[predecessor]
        req_type = str(definition.get("type", TYPE_MAP[base["requirement_type"]]))
        modality = str(definition.get("modality", base["source_modality"]))
        classification = str(definition.get("classification", base["classification"]))
        target = str(definition.get("target", base["delivery_target"]))
        layer = str(definition.get("layer", base["responsible_layer"]))
        for locator, summary in definition["items"]:  # type: ignore[index]
            output.append(make_replacement(
                base,
                str(locator),
                str(summary),
                modality,
                req_type,
                target,
                classification,
                predecessor,
                layer,
            ))
    return output


def core_replacement_rows(rows_by_id: dict[str, dict[str, str]]) -> list[dict[str, str]]:
    return [
        make_replacement(
            rows_by_id["REQ-070.01"],
            "L3289–L3291",
            "The dashboard prioritizes the most important user information.",
            "SHOULD",
            "Quality",
            "V1",
            "CBR",
            "REQ-070.01",
            "Frontend handoff",
        ),
        make_replacement(
            rows_by_id["REQ-074.05"],
            "L3615",
            "Marketing avoids unrealistic claims.",
            "MUST",
            "Quality",
            "V1",
            "CD",
            "REQ-074.05",
            "Marketing/Compliance",
        ),
        make_replacement(
            rows_by_id["REQ-081.08"],
            "L4257",
            "The infrastructure evaluation analyzes suitable startup infrastructure options without preselecting one.",
            "SHOULD",
            "Deliverable",
            "Pre-implementation deliverable",
            "REC",
            "REQ-081.08",
            "DevOps/Architecture",
        ),
        make_replacement(
            rows_by_id["REQ-085.01"],
            "L4481",
            "The architecture defines a reliable background-job system.",
            "SHOULD",
            "Non-functional",
            "V1",
            "REC",
            "REQ-085.01",
            "Backend/DevOps",
        ),
    ]


def traced_option(
    base: dict[str, str],
    lines: list[str],
    locator: str,
    summary: str,
    reason: str,
) -> dict[str, str]:
    row = deepcopy(base)
    row["verified_exact_line_range"] = locator
    row["source_wording"] = source_wording(lines, locator)
    row["source_summary"] = summary
    return may_trace_row(row, reason)


def semantic_option_traces(rows_by_id: dict[str, dict[str, str]], lines: list[str]) -> list[dict[str, str]]:
    output: list[dict[str, str]] = []
    for rid in sorted(SEMANTIC_DROP_TO_MAY):
        output.append(may_trace_row(
            rows_by_id[rid],
            "Illustrative example or explicitly suggested option; the controlling MUST/SHOULD obligation is captured separately.",
        ))
    output.extend([
        traced_option(rows_by_id["REQ-070.01"], lines, "L3293–L3309", "Suggested dashboard information order.", "Suggested order only; excluded from the formal REQ total."),
        traced_option(rows_by_id["REQ-074.05"], lines, "L3615–L3621", "Examples of unrealistic marketing claims.", "Illustrative prohibited-claim examples; the broad prohibition remains a formal requirement."),
        traced_option(rows_by_id["REQ-036.22"], lines, "L1613", "Notion as an example interactive roadmap tool.", "Named tool example only; the generic project-management compatibility requirement remains formal."),
        traced_option(rows_by_id["REQ-093.10"], lines, "L4929", "Notion as an example compatible project-management tool.", "Named tool example only; the generic compatibility requirement remains formal."),
        traced_option(rows_by_id["REQ-081.08"], lines, "L4259–L4277", "Named examples of startup infrastructure services.", "Options introduced with ‘such as’; excluded from the formal REQ total."),
        traced_option(rows_by_id["REQ-085.01"], lines, "L4467–L4479", "Example background-processing workloads.", "Examples only; the reliable job-system obligation is captured separately."),
        traced_option(rows_by_id["REQ-075.19"], lines, "L3733–L3741", "Example Survey Education article topics.", "Examples only; excluded from the formal REQ total."),
        traced_option(rows_by_id["REQ-075.19"], lines, "L3747–L3755", "Example Rewards Education article topics.", "Examples only; excluded from the formal REQ total."),
        traced_option(rows_by_id["REQ-075.19"], lines, "L3761–L3769", "Example Trust Content article topics.", "Examples only; excluded from the formal REQ total."),
        traced_option(rows_by_id["REQ-075.19"], lines, "L3777–L3785", "Example search-based article titles.", "Examples only; excluded from the formal REQ total."),
        traced_option(rows_by_id["REQ-076.03"], lines, "L3819–L3825", "Example educational-video topics.", "Examples only; excluded from the formal REQ total."),
        traced_option(rows_by_id["REQ-076.03"], lines, "L3829–L3835", "Example platform-update video topics.", "Examples only; excluded from the formal REQ total."),
        traced_option(rows_by_id["REQ-076.03"], lines, "L3839–L3845", "Example trust-building video topics.", "Examples only; excluded from the formal REQ total."),
        traced_option(rows_by_id["REQ-076.07"], lines, "L3895–L3897", "LinkedIn as a future consideration.", "Future consideration only; the separate SHOULD NOT launch-priority clause remains formal."),
        traced_option(rows_by_id["REQ-077.17"], lines, "L3981–L3995", "Example blog SEO pillar and supporting articles.", "Example content only; excluded from the formal REQ total."),
    ])
    return output


def normalize_candidate(
    row: dict[str, str],
    lines: list[str],
    active_headings: dict[int, tuple[int, str]],
) -> dict[str, str]:
    row = deepcopy(row)
    start = first_line(row["verified_exact_line_range"])
    section_line, section = active_headings[start]
    row["exact_constitution_section"] = section
    row["requirement_type"] = TYPE_MAP.get(row["requirement_type"], row["requirement_type"])
    row["source_wording"] = source_wording(lines, row["verified_exact_line_range"])
    row["source_digest_sha256"] = hashlib.sha256(row["source_wording"].encode("utf-8")).hexdigest()
    row["related_phase_0_document"] = phase_docs(row["exact_constitution_part"], section, row["responsible_layer"])
    if row["dependencies"] == "None stated by the Constitution":
        row["dependencies"] = "None directly identified"
    row["owner_approval_state"] = "Pending independent review"
    row["implementation_status"] = "Not started"
    row.setdefault("predecessor_requirement_id", row.get("requirement_id", "—"))
    row["atomicity_review"] = "Pending clause-level semantic confirmation"
    row["modality_resolution"] = "Single-modality clause or imperative reviewed in canonical context."
    return row


def apply_context_corrections(row: dict[str, str]) -> None:
    old = row["predecessor_requirement_id"]
    if old == "REQ-081.08" and row["verified_exact_line_range"] == "L4257–L4277":
        row.update({
            "source_modality": "SHOULD",
            "requirement_type": "Deliverable",
            "delivery_target": "Pre-implementation deliverable",
            "classification": "REC",
            "source_summary": "The infrastructure evaluation analyzes the named cloud, serverless, database, Apps Script, and other suitable startup options without preselecting one.",
        })
    if old in {f"REQ-075.{number:02d}" for number in range(2, 11)}:
        item_line = parse_ranges(row["verified_exact_line_range"])[-1][0]
        lead = "L3675; L3683" if old != "REQ-075.10" else "L3675"
        row["verified_exact_line_range"] = f"{lead}; L{item_line}"
        row["source_modality"] = "SHOULD"
        row["classification"] = "REC"
    if old == "REQ-075.11":
        row["verified_exact_line_range"] = "L3675; L3705–L3707"
        row["source_modality"] = "SHOULD"
        row["classification"] = "REC"
    if old.startswith("REQ-095.") and old != "REQ-095.01":
        row["verified_exact_line_range"] = f"L5147; {row['verified_exact_line_range']}"

    if old == "REQ-006.08":
        row["source_summary"] = (
            "If the business enables phone OTP, it occurs only when required for sensitive actions."
        )
    if old == "REQ-015.02":
        row["verified_exact_line_range"] = "L795"
    if old == "REQ-008.01":
        row["verified_exact_line_range"] = "L483"
    if old == "REQ-093.10":
        row["source_summary"] = "The roadmap is compatible with project-management tools."
    if old == "REQ-093.11":
        row["delivery_target"] = "V1"
    if old in {f"REQ-002.{number:02d}" for number in range(2, 8)}:
        row["verified_exact_line_range"] = row["verified_exact_line_range"].replace("L131", "L133")
        row["_section_override"] = "Phase 1"
    if old in {f"REQ-075.{number:02d}" for number in range(2, 11)}:
        row["_section_override"] = "PHASE 1 — FOUNDATION"

    if row["verified_exact_line_range"] == "L397":
        row["modality_resolution"] = (
            "The single source line contains two independent clauses. This row records only the modality of its stated summary; "
            "the other clause is represented by a separate formal row."
        )
    if row["verified_exact_line_range"] == "L469":
        row["modality_resolution"] = (
            "Line 469 contains MUST, MAY, and SHOULD clauses. This row records only the clause stated in its summary; "
            "MAY permission examples are non-counted source options and the other modalities are separate rows."
        )


def atomicity_review(row: dict[str, str]) -> str:
    segments = len(re.split(r" / | \|\| ", row["source_wording"]))
    summary = row["source_summary"]
    if segments >= 5 and "," in summary and re.search(r"\band\b", summary, re.IGNORECASE):
        if "lifecycle" in summary.lower() and "order" in summary.lower():
            return "Reviewed as one indivisible ordered state-machine constraint; splitting would remove the required sequence."
        if row["predecessor_requirement_id"] in {"REQ-079.22", "REQ-088.14"}:
            return "Reviewed as one decision gate whose listed measures or scale bands are jointly required for the single decision."
        if row["predecessor_requirement_id"].startswith("REQ-093.1"):
            return "Reviewed as one roadmap-phase scope boundary; child implementation tasks are generated later from the approved roadmap."
        return "REQUIRES ATOMIC SPLIT BEFORE APPROVAL"
    return "Reviewed — one independently verifiable clause"


def may_trace_row(row: dict[str, str], reason: str) -> dict[str, str]:
    return {
        "record_type": "MAY_SOURCE_OPTION",
        "record_id": "",
        "predecessor_requirement_id": row["requirement_id"],
        "exact_constitution_part": row["exact_constitution_part"],
        "verified_exact_line_range": row["verified_exact_line_range"],
        "source_wording": row["source_wording"],
        "source_summary": row["source_summary"],
        "disposition": reason,
        "counted_in_formal_req_total": "No",
    }


def build(args: argparse.Namespace) -> dict[str, object]:
    lines = args.source.read_text(encoding="utf-8").splitlines()
    source_bytes = args.source.read_bytes()
    active, heading_starts = heading_map(lines)
    original = load_rows(args.requirements)
    by_id = {row["requirement_id"]: row for row in original}
    may_rows: list[dict[str, str]] = []
    retained: list[dict[str, str]] = []

    for row in original:
        rid = row["requirement_id"]
        if rid == "REQ-001.05":
            option = deepcopy(row)
            option["verified_exact_line_range"] = "L77–L103"
            option["source_wording"] = source_wording(lines, option["verified_exact_line_range"])
            may_rows.append(may_trace_row(option, "Pure MAY feature examples; excluded from formal REQ total."))
            continue
        if rid in DROP_TO_MAY:
            may_rows.append(may_trace_row(row, "Pure MAY, possible, suggested, or optional example; excluded from formal REQ total."))
            continue
        if rid in SEMANTIC_DROP_TO_MAY:
            continue
        if rid in SPLIT_DEFINITIONS or rid in CORE_REPLACEMENT_IDS:
            continue
        if rid in REMOVE_FOR_REPLACEMENT:
            if rid in {"REQ-007.07", "REQ-007.08", "REQ-007.09", "REQ-007.10"}:
                may_rows.append(may_trace_row(row, "Example Limit Template permission from a MAY clause; excluded from formal REQ total."))
            continue
        row = deepcopy(row)
        row["predecessor_requirement_id"] = rid
        retained.append(row)

    retained.extend(replacement_rows(by_id))
    retained.extend(split_rows(by_id))
    retained.extend(core_replacement_rows(by_id))
    may_rows.extend(semantic_option_traces(by_id, lines))

    normalized = []
    for row in retained:
        row = normalize_candidate(row, lines, active)
        apply_context_corrections(row)
        # Context corrections can change locators and therefore active heading/digest.
        start = first_line(row["verified_exact_line_range"])
        row["exact_constitution_section"] = row.pop("_section_override", active[start][1])
        row["source_wording"] = source_wording(lines, row["verified_exact_line_range"])
        row["source_digest_sha256"] = hashlib.sha256(row["source_wording"].encode("utf-8")).hexdigest()
        row["related_phase_0_document"] = phase_docs(row["exact_constitution_part"], row["exact_constitution_section"], row["responsible_layer"])
        normalized.append(row)

    for row in normalized:
        row["owner_approval_state"] = args.approval_state

    # Rebuild structural parents from exact headings, in canonical order.
    heading_line_for: dict[tuple[str, str], int] = {}
    for heading_line in heading_starts:
        part = next(
            part_name
            for part_name, (part_start, part_end) in PART_RANGES.items()
            if part_start <= heading_line <= part_end
        )
        heading_line_for[(part, lines[heading_line - 1].strip())] = heading_line

    used_sections: dict[tuple[str, str], int] = {}
    for row in normalized:
        key = (row["exact_constitution_part"], row["exact_constitution_section"])
        used_sections[key] = heading_line_for[key]
    ordered_sections = sorted(used_sections, key=lambda key: used_sections[key])
    parent_for = {key: f"REQ-{index:03d}" for index, key in enumerate(ordered_sections, start=1)}
    grouped: dict[tuple[str, str], list[dict[str, str]]] = defaultdict(list)
    for row in normalized:
        grouped[(row["exact_constitution_part"], row["exact_constitution_section"])].append(row)

    final_rows: list[dict[str, str]] = []
    change_map: list[dict[str, str]] = []
    parents: list[dict[str, str]] = []
    for key in ordered_sections:
        part, section = key
        parent_id = parent_for[key]
        section_rows = sorted(grouped[key], key=lambda row: (first_line(row["verified_exact_line_range"]), row["source_summary"]))
        section_start = used_sections[key]
        next_heading_lines = sorted(line for line in heading_starts if line > section_start)
        section_end = (next_heading_lines[0] - 1) if next_heading_lines else len(lines)
        section_end = min(section_end, PART_RANGES[part][1])
        parents.append({
            "parent_requirement_id": parent_id,
            "counted_in_formal_req_total": "No — structural container only",
            "exact_constitution_part": part,
            "exact_constitution_section": section,
            "section_source_span": f"L{section_start}–L{section_end}",
            "atomic_child_count": str(len(section_rows)),
            "owner_approval_state": args.approval_state,
            "implementation_status": "Not started",
        })
        for index, row in enumerate(section_rows, start=1):
            predecessor = row.get("predecessor_requirement_id", "—")
            new_id = f"{parent_id}.{index:02d}"
            row["requirement_id"] = new_id
            row["parent_requirement_id"] = parent_id
            row["atomicity_review"] = atomicity_review(row)
            row["atomic_acceptance_criteria"] = acceptance(row)
            row["evidence_requirement"] = evidence(row)
            final_rows.append(row)
            change_map.append({
                "predecessor_requirement_id": predecessor,
                "replacement_requirement_id": new_id,
                "change_type": "Retained and re-anchored" if predecessor != "—" else "Added from omitted canonical clause",
                "exact_constitution_part": part,
                "exact_constitution_section": section,
                "verified_exact_line_range": row["verified_exact_line_range"],
                "change_summary": "Exact heading, taxonomy, Phase 0 mapping, acceptance criterion, and evidence rule corrected.",
            })

    for index, row in enumerate(may_rows, start=1):
        row["record_id"] = f"MAY-{index:03d}"

    output = args.output
    write_rows(output / "EP-P0-01-Atomic-Requirements.csv", FIELDS, final_rows)
    write_rows(output / "EP-P0-01-Structural-Parents.csv", list(parents[0]), parents)
    write_rows(output / "EP-P0-01-MAY-Source-Options.csv", list(may_rows[0]), may_rows)
    write_rows(output / "EP-P0-01-Change-Map.csv", list(change_map[0]), change_map)

    unused_heading_dispositions = {
        3: "Duplicate project-name/tagline declaration; the same identity constraints are formalized under PROJECT NAME and BRAND IDENTITY.",
        2499: "Narrative transition and quality rationale, not an independently implementable clause.",
        3745: "Content-category label inside CONTENT MARKETING STRATEGY; category coverage is formalized under the containing section.",
        3759: "Content-category label inside CONTENT MARKETING STRATEGY; category coverage is formalized under the containing section.",
        3815: "List label inside YOUTUBE STRATEGY, not an independent Constitution section.",
        4449: "OTP option item inside OTP INFRASTRUCTURE, not an independent Constitution section; represented by a formal child under the containing section.",
    }
    section_coverage = []
    for heading_line in heading_starts:
        part = next(
            part_name
            for part_name, (part_start, part_end) in PART_RANGES.items()
            if part_start <= heading_line <= part_end
        )
        heading = lines[heading_line - 1].strip()
        parent_id = parent_for.get((part, heading), "")
        section_coverage.append({
            "exact_constitution_part": part,
            "heading_line": f"L{heading_line}",
            "exact_heading": heading,
            "coverage_status": "Formal REQ children extracted" if parent_id else "Reviewed — no separate formal REQ",
            "structural_parent_id": parent_id or "None",
            "disposition": "" if parent_id else unused_heading_dispositions.get(heading_line, "UNRESOLVED HEADING DISPOSITION"),
        })
    write_rows(
        output / "EP-P0-01-Section-Coverage.csv",
        list(section_coverage[0]),
        section_coverage,
    )

    register_counts: dict[str, int] = {}
    for filename in ("EP-P0-01-ODR.csv", "EP-P0-01-DDR.csv", "EP-P0-01-EFE.csv", "EP-P0-01-OCR.csv"):
        rows = load_rows(args.candidate / filename)
        if filename == "EP-P0-01-ODR.csv":
            for row in rows:
                if row["record_id"] == "ODR-001":
                    row["status"] = "Resolved — authoritative handoff map"
                    row["decision_or_evidence_needed"] = "Resolved by the Phase 0 Agent Handoff & Audit Log document index."
                    row["notes"] = "EP-P0-01 through EP-P0-13 titles and dependencies are now mapped in every formal REQ."
            rows.append({
                "record_type": "ODR",
                "record_id": "ODR-028",
                "label": "ODR",
                "title": "Administrative account-state taxonomy and transitions",
                "description": "Part 1 names Normal Verified and Limited states, while Part 3 gives Active, Limited, Suspended, Disabled, and Archived as examples; the authoritative V1 taxonomy and transitions are not decided.",
                "source_locator": "L457–L469; L1181–L1197",
                "source_excerpt": source_wording(lines, "L457–L469; L1181–L1197"),
                "status": "Open",
                "owner": "Product Owner",
                "decision_or_evidence_needed": "Approve canonical state names, meanings, allowed transitions, UI labels, migration rules, Limit Template interaction, and effects on authentication, surveys, wallet, withdrawals, and support.",
                "dependencies": "ODR-013; ODR-025; DDR-005; DDR-015",
                "notes": "The Part 3 example list is not treated as a closed formal enum until this decision is approved.",
            })
        if filename == "EP-P0-01-DDR.csv":
            rows.append({
                "record_type": "DDR",
                "record_id": "DDR-015",
                "label": "DERIVED PROPOSAL — REQUIRES ARCHITECTURE OR OWNER APPROVAL",
                "title": "Account-state transition history",
                "description": "Record each administrative account-state transition as an append-only event containing prior state, new state, actor, reason, timestamp, and related Limit Template change.",
                "source_locator": "L457–L471; L1181–L1197; L1407–L1443",
                "source_excerpt": source_wording(lines, "L457–L471; L1181–L1197; L1407–L1443"),
                "status": "Open",
                "owner": "Product Owner",
                "decision_or_evidence_needed": "Architecture and compliance approval of event schema, retention, immutability, correction, access, and migration behavior.",
                "dependencies": "ODR-013; ODR-023; ODR-028; DDR-005; DDR-007",
                "notes": "This mechanism is derived; the Constitution does not state it as formal wording.",
            })
        register_counts[filename.removeprefix("EP-P0-01-").removesuffix(".csv")] = len(rows)
        write_rows(output / filename, list(rows[0]), rows)

    def formal_ids_for_lines(*line_numbers: int) -> str:
        identifiers = {
            row["requirement_id"]
            for row in final_rows
            if any(
                start <= line_number <= end
                for start, end in parse_ranges(row["verified_exact_line_range"])
                for line_number in line_numbers
            )
        }
        return "; ".join(sorted(identifiers)) or "None"

    def option_ids_for_lines(*line_numbers: int) -> str:
        identifiers = {
            row["record_id"]
            for row in may_rows
            if any(
                start <= line_number <= end
                for start, end in parse_ranges(row["verified_exact_line_range"])
                for line_number in line_numbers
            )
        }
        return "; ".join(sorted(identifiers)) or "None"

    legacy_reassessment = [
        {
            "legacy_requirement_id": "REQ-006",
            "review_issue": "Excluded launch markets were previously at risk of being strengthened into a MUST or an invented enforcement mechanism.",
            "canonical_source": "L367",
            "formal_replacement_ids": formal_ids_for_lines(367),
            "non_counted_or_governance_records": "ODR-003",
            "disposition": "Preserved as four atomic SHOULD launch exclusions; no enforcement mechanism or stronger modality was added.",
            "result": "PASS",
        },
        {
            "legacy_requirement_id": "REQ-009",
            "review_issue": "Future multilingual capability and V1 disablement have different modalities and must not be bundled or tied to an invented framework.",
            "canonical_source": "L397",
            "formal_replacement_ids": formal_ids_for_lines(397),
            "non_counted_or_governance_records": "None",
            "disposition": "Split into SHOULD technical possibility and MUST not enabled in V1; no implementation framework was invented.",
            "result": "PASS",
        },
        {
            "legacy_requirement_id": "REQ-019",
            "review_issue": "Part 1 and Part 3 use different account-state vocabularies; example states cannot silently become the approved enum.",
            "canonical_source": "L457–L469; L1181–L1197",
            "formal_replacement_ids": formal_ids_for_lines(459, 467, 469, 1183, 1197),
            "non_counted_or_governance_records": f"{option_ids_for_lines(1185)}; ODR-028; DDR-015",
            "disposition": "Binding state support remains formal, the Part 3 example list is non-counted, and taxonomy/transition resolution is deferred to ODR-028.",
            "result": "PASS — OWNER DECISION OPEN",
        },
        {
            "legacy_requirement_id": "REQ-027",
            "review_issue": "The predecessor asserted that no earning stage may be skipped, wording absent from the Constitution.",
            "canonical_source": "L665–L693",
            "formal_replacement_ids": formal_ids_for_lines(669),
            "non_counted_or_governance_records": f"{option_ids_for_lines(671)}; OCR-001; OCR-002; DDR-002; ODR-016; ODR-027",
            "disposition": "Removed the unsupported no-skip assertion. The illustrated lifecycle is non-counted; binding provider-confirmation, maturity, and cleared-funds rules remain owner clarifications.",
            "result": "PASS",
        },
        {
            "legacy_requirement_id": "REQ-031",
            "review_issue": "Architectural support for named withdrawal methods must not be represented as approved V1 activation.",
            "canonical_source": "L811–L823",
            "formal_replacement_ids": formal_ids_for_lines(813, 815, 823),
            "non_counted_or_governance_records": "ODR-005; ODR-006",
            "disposition": "Retained professional/transparent experience and support-ready architecture as SHOULD; V1 method activation remains an owner decision.",
            "result": "PASS — OWNER DECISION OPEN",
        },
        {
            "legacy_requirement_id": "REQ-055",
            "review_issue": "The normalization qualifier ‘typically’ and exception ‘unless justified otherwise’ must be preserved.",
            "canonical_source": "L2083",
            "formal_replacement_ids": formal_ids_for_lines(2083),
            "non_counted_or_governance_records": "None",
            "disposition": "Preserved the complete qualifier and exception in both source wording and summary.",
            "result": "PASS",
        },
        {
            "legacy_requirement_id": "REQ-058",
            "review_issue": "An account-state-history implementation mechanism was previously presented as Constitution wording.",
            "canonical_source": "L457–L471; L1181–L1197; L1407–L1443",
            "formal_replacement_ids": formal_ids_for_lines(459, 471, 1183, 1409),
            "non_counted_or_governance_records": "ODR-028; DDR-015",
            "disposition": "No fabricated state-history mechanism remains formal. The proposed transition history is explicitly separated as DDR-015.",
            "result": "PASS",
        },
        {
            "legacy_requirement_id": "REQ-076",
            "review_issue": "Startup-friendly infrastructure is a constitutional MUST, not a recommendation.",
            "canonical_source": "L4201",
            "formal_replacement_ids": formal_ids_for_lines(4201),
            "non_counted_or_governance_records": "ODR-008",
            "disposition": "Split startup-friendly and enterprise-ready attributes into two atomic MUST requirements.",
            "result": "PASS",
        },
        {
            "legacy_requirement_id": "REQ-080",
            "review_issue": "CI/CD inclusions must retain the source SHOULD modality.",
            "canonical_source": "L4539–L4553",
            "formal_replacement_ids": formal_ids_for_lines(4541, 4543, 4545, 4547, 4549, 4551, 4553),
            "non_counted_or_governance_records": "None",
            "disposition": "Deployment, validation, test, build, rollback, and deployment-pipeline clauses remain separate SHOULD requirements.",
            "result": "PASS",
        },
        {
            "legacy_requirement_id": "REQ-085",
            "review_issue": "The controlled workflow and eight phase scopes must be traceable without collapsing their independently testable scope items.",
            "canonical_source": "L4933–L5063",
            "formal_replacement_ids": formal_ids_for_lines(4935, *range(4943, 5064, 2)),
            "non_counted_or_governance_records": "None",
            "disposition": "The controlled-phases rule remains SHOULD; every named phase scope item is a separate atomic child requirement.",
            "result": "PASS",
        },
    ]
    write_rows(
        output / "EP-P0-01-Flagged-Predecessor-Reassessment.csv",
        list(legacy_reassessment[0]),
        legacy_reassessment,
    )

    dispositions = [
        {
            "record_id": "DISP-001",
            "line_range": "L1629–L1635",
            "source_text": source_wording(lines, "L1629–L1635"),
            "disposition": "Narrative transition into the Constitution; the binding governance statement at L1633 is separately captured as a formal Process requirement.",
        },
        {
            "record_id": "DISP-002",
            "line_range": "L2023–L2027",
            "source_text": source_wording(lines, "L2023–L2027"),
            "disposition": "Explanatory design rationale, not a standalone product requirement; its flexibility rule is represented by the database design clauses that follow.",
        },
        {
            "record_id": "DISP-003",
            "line_range": "L4127–L4133",
            "source_text": source_wording(lines, "L4127–L4133"),
            "disposition": "Pure MAY paid-advertising channel examples; excluded from the formal REQ total and retained as a source option.",
        },
        {
            "record_id": "DISP-004",
            "line_range": "L5147",
            "source_text": source_wording(lines, "L5147"),
            "disposition": "Modality context, not an independent deliverable; added to every applicable documentation-item citation.",
        },
    ]
    write_rows(output / "EP-P0-01-Source-Dispositions.csv", list(dispositions[0]), dispositions)

    atomicity_pending = [row for row in final_rows if row["atomicity_review"].startswith("REQUIRES")]
    summary = {
        "source": {
            "lines": len(lines),
            "words": len(args.source.read_text(encoding="utf-8").split()),
            "bytes": len(source_bytes),
            "sha256": hashlib.sha256(source_bytes).hexdigest(),
        },
        "formal_requirements": len(final_rows),
        "structural_parents": len(parents),
        "may_source_options": len(may_rows),
        "atomicity_splits_still_required": len(atomicity_pending),
        "by_part": dict(Counter(row["exact_constitution_part"] for row in final_rows)),
        "by_modality": dict(Counter(row["source_modality"] for row in final_rows)),
        "by_classification": dict(Counter(row["classification"] for row in final_rows)),
        "by_type": dict(Counter(row["requirement_type"] for row in final_rows)),
        "by_delivery_target": dict(Counter(row["delivery_target"] for row in final_rows)),
        "governance_registers": register_counts,
        "status": args.document_status or (
            "CORRECTIVE CANDIDATE — ATOMICITY SPLITS PENDING"
            if atomicity_pending
            else "REVISION COMPLETED — PENDING INDEPENDENT SEMANTIC REVIEW"
        ),
    }
    (output / "EP-P0-01-Corrective-Summary.json").write_text(json.dumps(summary, indent=2) + "\n", encoding="utf-8")

    status_text = f"""# EP-P0-01 v3 status

**{summary['status']}**

- Canonical source: `{hashlib.sha256(source_bytes).hexdigest()}`
- Formal atomic requirements: {len(final_rows):,}
- Structural parents: {len(parents):,}
- Non-counted MAY/example options: {len(may_rows):,}
- ODR / DDR / EFE / OCR: {register_counts['ODR']} / {register_counts['DDR']} / {register_counts['EFE']} / {register_counts['OCR']}
- Owner approval state on formal requirements: {args.approval_state}

This baseline authorizes Phase 0 derivative documentation only. It does not
approve architecture choices, resolve open ODRs, authorize production claims, or
permit Phase 1 implementation before EP-P0-02 through EP-P0-13 pass their gates.
"""
    (output / "STATUS.md").write_text(status_text, encoding="utf-8")

    return summary


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--source", type=Path, required=True)
    parser.add_argument("--candidate", type=Path, required=True)
    parser.add_argument("--requirements", type=Path, required=True)
    parser.add_argument("--output", type=Path, required=True)
    parser.add_argument("--approval-state", default="Pending independent review")
    parser.add_argument("--document-status")
    args = parser.parse_args()
    print(json.dumps(build(args), indent=2))


if __name__ == "__main__":
    main()
