# Zplug home
export ZPLUG_HOME="$HOME/.zplug"

source "$ZPLUG_HOME/zplug"

zplug "zplug/zplug"
# Don't forget to run `nvm install node && nvm alias default node`
zplug "creationix/nvm", from:github, as:plugin, use:nvm.sh
zplug "lib/directories", from:oh-my-zsh
zplug "lib/key-bindings", from:oh-my-zsh
zplug "plugins/brew", from:oh-my-zsh, if:"[[ $(uname) =~ ^Darwin ]]"
zplug "plugins/docker", from:oh-my-zsh
zplug "plugins/git", from:oh-my-zsh, if:"(( $+commands[git] ))", nice:10
zplug "plugins/git-extras", from:oh-my-zsh
zplug "plugins/tmuxinator", from:oh-my-zsh
zplug "plugins/vagrant", from:oh-my-zsh
zplug "zsh-users/zsh-history-substring-search"

zplug "lib/theme-and-appearance", from:oh-my-zsh
# zplug "$ZSH/zsh/custom/vonder.zsh-theme", from:local, nice:10

zplug "zsh-users/zsh-syntax-highlighting", nice:10

zplug check || zplug install
zplug load

if zplug check "creationix/nvm" && [[ $(nvm current) == "none" ]]; then
    nvm install stable
    nvm alias default stable
fi
