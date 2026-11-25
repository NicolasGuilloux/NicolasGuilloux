{ pkgs, ... }:

{
  imports = [ ./devenv.ai.nix ];

  # https://devenv.sh/packages/
  packages = with pkgs; [
    git
    go
    hugo
    asciidoctor
  ];

  # https://devenv.sh/scripts/
  scripts.build.exec = "hugo --gc --minify 2> >(grep -v 'locally installed gems' >&2)";
  scripts.serve.exec = "hugo server -D 2> >(grep -v 'locally installed gems' >&2)";

  # See full reference at https://devenv.sh/reference/options/
}
