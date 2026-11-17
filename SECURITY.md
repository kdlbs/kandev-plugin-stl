# Security and resource boundaries

The host supplies authorized, bounded bytes. The plugin has no declared Host
capabilities and no selected-path, URL, or filesystem loader. The worker uses
only packaged JavaScript. Names and headers are inert; they are never rendered
as HTML. Parser failures produce a fixed message without model content.

Binary files require an exact 84 + 50 × triangle-count layout. The count and all
vertex/normal floats are checked before STLLoader allocates geometry. ASCII uses
a two-pass byte tokenizer, not the unbounded stock ASCII loader. Tokens are
limited to 64 bytes, names to 1024 bytes, facets to one million, and input to
64 MiB. Truncated grammar and non-finite values fail. Main-thread geometry
validation repeats array-length, finiteness, and bounds checks before GPU upload.

At the binary ceiling, input is approximately 50 MB. STLLoader can temporarily
allocate 108 MB for positions, normals, and optional colours. Rendering retains
36 MB positions, 36 MB normals, and estimates 72 MB GPU geometry. Worker
termination releases loader temporaries before scene creation. At the ASCII
ceiling, input is at most 64 MiB, output positions 36 MB, CPU normals 36 MB,
and estimated GPU geometry 72 MB. There is no full decoded ASCII string or
retained token list. These accounted allocations fit the host's 256 MiB budget.
A conservative admission calculation reserves source bytes, five geometry arrays,
and 16 MiB for framebuffer attachments within 256 MiB. The canvas is capped at
two million pixels without multisampling. Browser, worker-runtime, and driver overhead are additional;
this is not an OS memory limit. Representative-device validation remains a
release gate.

Each viewer owns its worker and scene. It terminates parsing after ten seconds.
Unmount aborts reading, terminates the worker, detaches controls and observers,
and disposes geometry, material, grid, renderer, and WebGL context. There is no
continuous animation loop. A lost WebGL context produces a recovery message.

The host's Ask/Allow/Deny policy is an informed-consent boundary for supported
previews. Native same-origin code and the plugin process are not sandboxed.
Already delivered bytes cannot be recalled from malicious trusted code.
