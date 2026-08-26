# AURA Archive exact-duplicate cleanup map — 26 August 2026

## Scope

This pass removes only byte-identical duplicate paths from the navigable
archive. Near-duplicates, different formats, historical variants, and files
whose relationship is uncertain remain untouched. The pre-cleanup commit keeps
every removed path recoverable in Git history.

The audit found 17 duplicate groups (34 tracked paths). Each group below has
one retained canonical path and one removed redundant path.

## Removal map

| Blob SHA-1 | Retained path | Removed exact duplicate |
|---|---|---|
| `6d6636c74d6eeb2780c34311e56664519ec649a8` | `Veyra cascade/THe pyramid cascade system/Pyramid Cascade/CASCADE_COMPLETE_INTEGRATION.md` | `20 file(FULLSYSTEM) for full use break or expand/CASCADE_COMPLETE_INTEGRATION.md` |
| `1d8e24f9e0e81c49a694a9905f157d1c886e2d67` | `Chain.md - THe COnnection (lin3ked) (1).pdf` | `Chain.md - THe COnnection (lin3ked)-(All@1).pdf` |
| `05687f443aabbe4052128f967c934b94c9ff2558` | `full pyramid cascade system.pdf` | `Veyra cascade/THe pyramid cascade system/full pyramid cascade system (1).pdf` |
| `9ae9b474a724d3c64e19abeb3e7f353e632ca891` | `Veyra cascade/THe pyramid cascade system/Pyramid Cascade/cascade_mathematical_proofs.md` | `20 file(FULLSYSTEM) for full use break or expand/cascade_mathematical_proofs.md` |
| `4b553ac850fe684e862044e687d9cbc630423f31` | `1 file with all merged for easy use.pdf` | `@1SOVEREIGN_AI_Constitutional_MetaFramework_v2.0(compressed).pdf` |
| `40d34d663e6555c9afcb71aff5c30720f232c2fc` | `Veyra cascade/CASCADE_QUICK_REFERENCE.md` | `20 file(FULLSYSTEM) for full use break or expand/CASCADE_QUICK_REFERENCE.md` |
| `fa6b5f7ef33c9eba4c44f7f6ef268c46a8a2d691` | `Aura & grok full aura side log.rtf` | `Aura & grok full aura side log (lin3ked)-(A@1).rtf` |
| `f3e4377a67cae90f05027c63acef67e3dfc8bd35` | `Veyra cascade/architecture_map.md` | `20 file(FULLSYSTEM) for full use break or expand/architecture_map.md` |
| `67385fdbdf4e4d8fbc8045207a5872534e3e2087` | `Veyra cascade/THe pyramid cascade system/Pyramid Cascade/cascade_frontier_analysis.md` | `20 file(FULLSYSTEM) for full use break or expand/cascade_frontier_analysis.md` |
| `04f20d98ea23ed8bf64095567f2470bc0d53858f` | `Lock.Md - The Consitution(lin3ked (1).pdf` | `Lock.Md - The Consitution(lin3ked (A@1).pdf` |
| `73e68dce7cc4905d2c4086c6f75781bfc957d591` | `Veyra cascade/CASCADE_COMPLETE_FRAMEWORK.md` | `20 file(FULLSYSTEM) for full use break or expand/CASCADE_COMPLETE_FRAMEWORK.md` |
| `55a6a8c977ea66513d7e6d3331edc429826a9348` | `Veyra cascade/CASCADE_IMPLEMENTATION_GUIDE.md` | `20 file(FULLSYSTEM) for full use break or expand/CASCADE_IMPLEMENTATION_GUIDE.md` |
| `2da61efbd8e7c7193f6da7abf7568ce2cd777ad9` | `Veyra cascade/THe pyramid cascade system/Pyramid Cascade/cascade_complete_synthesis.md` | `20 file(FULLSYSTEM) for full use break or expand/cascade_complete_synthesis.md` |
| `02389d061e3bfcf04e058f01750dbc6e3d732499` | `Veyra cascade/framework_analysis.md` | `20 file(FULLSYSTEM) for full use break or expand/framework_analysis.md` |
| `371280149e02ed8ebcfb87475a021dba308fdde5` | `Veyra cascade/PACKAGE_MANIFEST.md` | `20 file(FULLSYSTEM) for full use break or expand/PACKAGE_MANIFEST.md` |
| `e6c10a0c26eb713b54e6fbd6858619af32c13638` | `Veyra cascade/unified_math_glossary.md` | `20 file(FULLSYSTEM) for full use break or expand/unified_math_glossary.md` |
| `2349545bf6a6c69cd449a1bb20ad729073785a73` | `Veyra cascade/EXECUTIVE_SUMMARY.md` | `20 file(FULLSYSTEM) for full use break or expand/EXECUTIVE_SUMMARY.md` |

## Recovery

The removed paths remain recoverable from the parent commit of the cleanup
commit and from the existing `main` history. This map is itself part of the
updated archive. No source text was rewritten by the duplicate removal.
