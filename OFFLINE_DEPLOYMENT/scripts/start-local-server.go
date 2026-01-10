// start-local-server.go
// Tiny static server in Go; compile to a single binary to serve the offline bundle.
package main

import (
  "flag"
  "fmt"
  "log"
  "net/http"
)

func main() {
  port := flag.Int("p", 8000, "port to serve on")
  dir := flag.String("d", ".", "directory to serve")
  flag.Parse()
  fs := http.FileServer(http.Dir(*dir))
  http.Handle("/", fs)
  addr := fmt.Sprintf(":%d", *port)
  log.Printf("Serving %s on HTTP port: %d\n", *dir, *port)
  log.Fatal(http.ListenAndServe(addr, nil))
}
