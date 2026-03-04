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
  scripts.build.exec = "hugo --gc --minify";
  scripts.serve.exec = "hugo server -D";
  scripts.theme-update.exec = ''
    hugo mod get -u github.com/CaiJimmy/hugo-theme-stack/v4
    hugo mod tidy
  '';

  # See full reference at https://devenv.sh/reference/options/
}
