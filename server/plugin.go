package main

import "github.com/kdlbs/kandev/pluginsdk"

// stlPlugin supplies the managed process required by native UI plugins.
// Rendering uses only the host-selected file API in the browser.
type stlPlugin struct{ pluginsdk.UnimplementedPlugin }

var _ pluginsdk.Plugin = (*stlPlugin)(nil)
