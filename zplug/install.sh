# Zplug home
export ZPLUG_HOME="$HOME/.zplug"

if test ! $(which zplug)
then
  echo "  Installing zplug for you."

  curl -sL git.io/zplug | zsh
  source "$ZPLUG_HOME/zplug"
  zplug update --self
fi
