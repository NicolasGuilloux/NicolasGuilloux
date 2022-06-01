{ pkgs ? import <nixpkgs> {} }:

pkgs.mkShell {
  buildInputs = [
    pkgs.texlive.combined.scheme-full

    # keep this line if you use bash
    pkgs.bashInteractive
  ];
}
