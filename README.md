# Morale Bot - The official discord bot for the Team Morale Boost Discord Server.

## Current Slash Commands

### Fun
* Balance - Displays how much Morale you have.
* Daily - Claim daily Morale. Resets every 24 hours.
* Poll - Creates a Poll. React to vote on the poll! (Future: Will use buttons!)
* Coinflip - Performs a coin flip. Optionally you can also bet Morale!
* Freebie - Lost all your Morale? Claim some free Morale!

### Utility
* Help - (WIP) Upcoming Command
* Userinfo - Displays your Discord user information. Optionally can bring up a pinged Discrod user's information.
* Ping - Pong!
* Restart - Admin Command that refreshes the database if users leave or join while the bot is offline.

### Voice
* Play - Plays various audio files that comes included with the bot.
* Disconnect - Disconnects the bot from voice chat.

## Setup

### Git LFS

All sound files for voice commands are stored using Git-LFS. Please install Git-LFS using your environment's package manager and run the following command **before cloning the repository**:

    git lfs install

**Note:** If you do not install Git-LFS, git will only download pointers to the sound files. Run ``git lfs fetch`` after you install and configure Git-LFS to download the sounds.

### Dockerfile

A Dockerfile is provided for your convenience. Assuming you have Docker installed on your machine, this will enable you to easily setup and run the bot using the following commands:

    docker build -t morale_bot:latest .
    docker run --rm morale_bot:latest

**Note:** When killing the running container with ``^C``, you may need to wait quite a while for the node to exit. Alternatively, you can kill the controlling terminal. However, if you choose to do so, you will then need to find and stop the container (see below commands). Otherwise, you risk running multiple instances of the bot at the same time.

    docker container ls
    docker container stop <container_id>  # Assumes you ran w/ --rm flag
    docker container ls  # Verify container was stopped

Ping Alex if you have questions.

## Contributing to the Project
Team Morale Boost Discord server members are welcome to contribute to the Discord Bot.
At this time we have a development team size of 5 and are no longer recruiting.
Stay tuned to see when we open up recruitment again!

## Documentation
Documentation for this project is currently maintained on Notion. 
Please request access to the Notion page to get onboarded as a developer.