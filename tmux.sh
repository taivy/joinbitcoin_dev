#!/usr/bin/env sh

SESSION=joinbitcoin

tmux has-session -t $SESSION
if [ $? -eq 0 ]; then
        echo "Session $SESSION already exists. Attaching."
        sleep 1
        tmux -2 attach -t $SESSION
        exit 0;
fi

tmux -2 new-session -d -s $SESSION

tmux rename-window -t $SESSION:0 git
tmux new-window -t $SESSION -a -n docker
tmux new-window -t $SESSION -a -n docker-logs
# tmux new-window -t $SESSION -a -n jupyter

tmux send-keys -t $SESSION:git "cd ~/Documents/Projects/joinbitcoin.org;git status" C-m
tmux send-keys -t $SESSION:docker "cd ~/Documents/Projects/joinbitcoin.org; #dc up -d" C-m
tmux send-keys -t $SESSION:docker-logs "cd ~/Documents/Projects/joinbitcoin.org; sleep 5; docker-compose logs -f --tail=50" C-m

tmux select-window -t $SESSION:docker
tmux -2 attach -t $SESSION

