washy-washy-cli(1)

# NAME

washy-washy-cli - turn a laundry chart into phone and print PDFs

# SYNOPSIS

*washy-washy-cli* [_config_] [*-o*|*--out* _dir_]

*washy-washy-cli* [*-h*|*--help*]

# DESCRIPTION

Reads a JSON chart of laundry piles, drawn for one specific washing machine
and iron, and writes six PDFs: a tall page for reading on a phone next to
the machine, an A4 reference sheet plus one card per pile for printing, and
each of those cut two ways again — everything, washing only, ironing only.
Also writes one small card PDF per pile or shared-card group.

Nothing on the page translates a fascia label. Whatever a dial reads in
_config_ is what the card prints; only the surrounding English is the
tool's own.

# OPTIONS

_config_
	Path to the machine+chart config to read. Defaults to
	*data/washy-washy.json*, falling back to the committed
	*data/washy-washy.json.dist* example when that file doesn't exist.

*-o*, *--out* _dir_
	Directory the six PDFs (and any per-pile card PDFs) are written to.
	Defaults to *out*. Created if it doesn't already exist.

*-h*, *--help*
	Print usage and exit.

# EXIT STATUS

Exits non-zero on a missing or invalid config, printing the reason to
stderr.

# SEE ALSO

The full chart format and worked examples are documented in the project's
README: https://github.com/alrayyes/washy-washy-cli
