{ pkgs, ... }:

{
  imports = [ ./devenv.ai.nix ];

  # https://devenv.sh/packages/
  packages = with pkgs; [
    git
    hugo
    asciidoctor
  ];

  # https://devenv.sh/scripts/
  scripts.build.exec = "hugo --gc --minify";
  scripts.serve.exec = "hugo server -D";

  # See full reference at https://devenv.sh/reference/options/
}
