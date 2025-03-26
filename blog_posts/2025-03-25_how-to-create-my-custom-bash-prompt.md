# How To Create My Custom Bash Prompt 

[tags]:- bash, tutorial, programming, shell

---

Terminals are in. Neovim is the new hotness. Tmux is universally loved. TUIs are
back in the dev-mainstream. We all know that the true 10x developer is
inseparable from their favorite terminal emulator and of course uses arch (btw).
However, there's a catch... how can you prove your based terminal productivity?

Imagine this: the opportunity comes when you're working on your sweet new
startup with zero users, and you need to prove your skills to your vscode-using
coworker. But wait! You use a boring vanilla terminal prompt. How will your
coworker know you're truly invested in the terminal lifestyle? That you are
objectively superior? What you need is a way to flex your supreme skills. This
article will guide you through writing a custom bash prompt. Lovingly
handwritten, artisinally crafted, and free of bloated shell plugins.

## What Is a $PS1 Variable and Where Is It Stored?

For those of you whose interaction with Bash begins and ends with `ls`, `cd`,
and `mkdir`, the existence and use of the $PS1 variable may be entirely new. In
short this variable exists to define the format of the command prompt in your
terminal. It stands for "Prompt String 1" and usually defaults to something like
this: `blazingly-fast@emacs-os ~/Documents/project-graveyard`, showing the
current username, hostname, and working directory. Through the powerful arcane
magic of reading the manual (or a cheat sheet/blog), you can warp reality (or at
least your terminal) to your will and become the envy of programmers the world
over.

To get started on this customization journey, you will need to open up the
`.bashrc` file in your home directory. You should of course use an approved 10x
dev editor (emacs, vim, ed, or a punch-card) to do this, but I won't expose you
if you throw out a quick `code .bashrc`. You can always come back into the fold.
In this file there will likely be a bunch of nonsense that you can ignore for
now. However, it's not a bad idea to do some googling later to figure out what
all is happening in your shell. For now, we're just going to add the new
variable at the bottom of the file so that it runs last and overwrites any
previous code.

## Basics

Once you have found and opened your `.bashrc` file in an approved
[non-quiche-eater](https://homepages.inf.ed.ac.uk/rni/papers/realprg.html)
editor to maintain your social capital, you'll want to add the following line to
the bottom of the file `export PS1="this is my prompt: " `. Make sure you don't
include a space between the read the variable correctly if there is a space.
After saving the file, go back to your terminal and run `source ~/.bashrc`. This
will make your shell read the changed value and apply the changes to your
prompt.

You should now see your changed prompt telling you absolutely nothing useful,
and reminding you that customization is the mother of all procrastination. Fear
not my fellow programmers! Nothing proves that you are a 10x dev like spending
weeks on something stupid that will bring you marginal (if any) benefits. You're
in good company, or at least company, so press on!

I will be going step-by-step through creating the prompt that I actively use.
You may hate my prompt, you'd be wrong, but nobody is perfect. Hopefully I'm
able to show you enough that you're able to tinker and shape a prompt that
perfectly suits you and your workflow.

--- 

Here is a list of options for reference as it is shown in the [bash
manual](https://www.gnu.org/savannah-checkouts/gnu/bash/manual/bash.html#Controlling-the-Prompt).

| key-code     | description                                                                                                          |
| :---------- | :------------------------------------------------------------------------------------------------------------------- |
|`\a`         | A bell character                                                                                                     |
|`\d`         | The date, in “Weekday Month Date” format (e.g., “Tue May 26”).                                                       |
|`\D{format}` | The format is passed to strftime(3) .... The braces are required.                                                    |
|`\e`         | An escape character.                                                                                                 |
|`\h`         | The hostname, up to the first ‘.’.                                                                                   |
|`\H`         | The hostname.                                                                                                        |
|`\j`         | The number of jobs currently managed by the shell.                                                                   |
|`\l`         | The basename of the shell’s terminal device name.                                                                    |
|`\n`         | A newline.                                                                                                           |
|`\r`         | A carriage return.                                                                                                   |
|`\s`         | The name of the shell, the basename of $0 (the portion following the final slash).                                   |
|`\t`         | The time, in 24-hour HH:MM:SS format.                                                                                |
|`\T`         | The time, in 12-hour HH:MM:SS format.                                                                                |
|`\@`         | The time, in 12-hour am/pm format.                                                                                   |
|`\A`         | The time, in 24-hour HH:MM format.                                                                                   |
|`\u`         | The username of the current user.                                                                                    |
|`\v`         | The version of Bash (e.g., 2.00).                                                                                    |
|`V`          | The release of Bash, version + patchlevel (e.g., 2.00.0).                                                            |
|`\w`         | The current working directory, with $HOME abbreviated with a tilde (uses the $PROMPT_DIRTRIM variable).              |
|`\W`         | The basename of $PWD, with $HOME abbreviated with a tilde.                                                           |
|`\!`         | The history number of this command.                                                                                  |
|`\#`         | The command number of this command.                                                                                  |
|`\$`         | If the effective uid is 0, #, otherwise $.                                                                           |
|`\nnn`       | The character whose ASCII code is the octal value nnn.                                                               |
|`\`          | A backslash.                                                                                                         |
|`\[`         | Begin a sequence of non-printing characters. This could be used to embed a terminal control sequence into the prompt.|
|`\]`         | End a sequence of non-printing characters.                                                                           |

---

## Building a Prompt

As we start editing the $PS1 variable, remember that you'll need to source your
config file to see the changes. You can do this by running this command `source
~/.bashrc`. You could also quit and re-open your terminal. That feels pretty
annoying to me, but hey pick your poison.

### Basic Examples

Here are some simple examples to get you used to the cycle of making a change,
sourcing the config file, and seeing the prompt update. I recommend writing each
example out and actually testing everything bit by bit. Don't just skip to the end
and copy the code, or do, I'm not your dad.

#### Just The User

Variable: `export PS1="\u "`

Example Output: `10xDev`

#### User and Full Working Directory Path

Variable: `export PS1="\u \w"`

Example Output: `10xDev ~/Documents/projects/react-project-9001` 

#### User and Full Working Directory Path w/@ Sign Separator

Variable: `export PS1="\u @ \w"`

Example Output: `10xDev @ ~/Documents/projects/react-project-9001` 

### Building My Prompt

#### Date and Time 

Here we are taking the current date, the time in AM/PM format, and the current
working directory rather than the full path.

Variable: `export PS1-"[\d / \@] \W "`

Example Output: `[Tue Mar 25 / 05:58 PM] react-project-9001`

#### Newline and Prompt Marker

I prefer multi-line prompts for both aesthetics and practicality. I think it
just looks better, but it also means that I have room to add additional
information into the prompt without the crowding the typing area. The prompt
marker `[=>] ` is purely for looks and to signify where you will be typing.

Variable: `export PS1-"[\d / \@] \W\n[=>] "`

Example Output: 
```
[Tue Mar 25 / 05:58 PM] react-project-9001
[=>] 
```

#### Displaying The Current Git Branch

It's super helpful for your prompt to display the current branch inside of a Git
repository. This isn't a feature that is built into Bash but can be done by
writing a function to inject the info into the PS1 variable string. I'm not
going through the details of the function here because I want this to be
focused on the prompt itself, but Bash scripting is a super useful skill to
develop!

Variable:
```
function parse_git_branch {
     git branch 2> /dev/null | sed -e '/^[^*]/d' -e 's/* \(.*\)/(\1)/'
}

export PS1="[\d / \@] \W \$(parse_git_branch)\n[=>] "
```

Example Output:
```
[Tue Mar 25 / 05:58 PM] react-project-9001 (why-wont-this-feature-work-v12)
[=>] 
```

### Adding Color To The Prompt

We all love a sweet color theme for our tools. After customizing the structure
of your prompt it can be genuinely satisfying to set up a clean set of colors,
both to make it look nice and to make the information easier to visually parse.

---

List of Color Codes

| Color  | Code |
| :----- | :--- |
| Black  | 30   |
| Blue   | 34   |
| Cyan   | 36   |
| Green  | 32   |
| Purple | 35   |
| Red    | 31   |
| White  | 37   |
| Yellow | 33   |

---

I strongly recommend storing the colors you want to use in variables in your
`.bashrc` file. It helps make the prompt much easier to read and less likely
for accidental typos to break your config. Color codes in Bash need to be
wrapped in the "non-printing character" markers `\[` and `\]` in order to work
correctly.

This sets the date/time section to green, the working directory to purple, the
Git branch to blue, the prompt marker to green, and resets the terminal color
back to white at the end.

Variable:
```
green="\[\e[32m\]"
purple="\[\e[35m\]"
blue="\[\e[36m\]"
white="\[\e[00m\]"

function parse_git_branch {
     git branch 2> /dev/null | sed -e '/^[^*]/d' -e 's/* \(.*\)/(\1)/'
}

export PS1="${green}[\d / \@] ${purple}\W ${blue}\$(parse_git_branch)\n${green}[=>]${white} "
```

### Conclusion

I hope this article was helpful in introducing you to what can be done with your
terminal prompt and encouraged you to start designing your development
environment. Happy hacking!
