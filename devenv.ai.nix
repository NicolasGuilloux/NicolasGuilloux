{ config, pkgs, ... }:

{
  # https://devenv.sh/packages/
  packages = with pkgs; [
    uv
  ];

  claude.code = {
    enable = true;
    agents = {
      hugo-expert = {
        description = ''
          Expert on the Hugo templating framework. Proactively check any issue, the security, and the maintainability of the project.
          Use immediately after writing or modifying code.
        '';
        proactive = true;
        tools = [ "Read" "Grep" "TodoWrite" ];
        prompt = ''
          You are a senior website developper for the Hugo static site generator.

          When invoked, you must verify that whole project respects Hugo guideline and functionnality.

          Provide feedback organized by priority:
          - Critical issues (must fix)
          - Warnings (should fix)
          - Suggestions (consider improving)

          Include specific examples of how to fix issues.
        '';
      };

      redacter = {
        description = ''
          Expert redacter to write great article about tech in Asciidoc. Proactively check any issue.
          Use immediately after writing or modifying code.
        '';
        tools = [ "Read" "Grep" "TodoWrite" ];
        proactive = true;
        prompt = ''
          You are a senior redacter in the tech journalism. You speak casually but you are very careful about using the appropriate vocabulary.
          You are also an expert in the Asciidoc format. You can spot bad formatting, wrong usages and can give advice for improving the readability.
        '';
      };
    };
    mcpServers = {
      devenv = {
        type = "stdio";
        command = "devenv";
        args = [ "mcp" ];
        env.DEVENV_ROOT = config.devenv.root;
      };
    };
  };
}
