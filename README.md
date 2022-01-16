# New Remote Camera Robot WebWorker Branch
## NOTE: This branch has been temporarily abandoned since web worker threads cannot interact directly with the gamepad/joystick.

This project is a modification of the original [Remote Camera Robot](https://https://github.com/DexterInd/GoPiGo3/tree/master/Projects/RemoteCameraRobot) project as developed by Dexter Industries for my GoPiGo-3 robot.

![](assets/20220108_203104_img1.jpg)

This currently works with a Saitek X52 joystick.  I hope to add support for
additional joysticks or a configuration file to define additional joysticks.
## Objectives:

1. Develop a way to encapsulate joystick events without polling on the main script

2. Learn how to create event listeners for both the main script and the worker script so that they can communicate asynchronously, without either one waiting for the other.

3. Learn how to manage a project with multiple branches both on GitHub and in VS Code.
## Challenges:

### Primary Limitations

1. I have very little knowlege of Git, GitHub, or version control in general.
    *  One of the objectives of this project is to increase my knowlege of the version control tools.
### Coding Challenges

1. Web Workers in general, and the documentation in particular, appear to be written for subject matter experts.&nbsp; That is, people who are already quite familiar with the topic.
    *  As a consequence, beginners, or those who do not have the subject matter expertise have trouble understanding exactly how the pieces fit together.

2. Web Worker processes may not be all they're cracked up to be as there are certain things that the cannot do - for example, they cannot reference the main window or the main DOM.
    *  As a consequence of that, I may not be able to delegate all the tasks to the worker that I'd like to.&nbsp; In fact, there's the very real possibility that I may not be able to delegate ***ANY*** of the joystick data collection and polling to the worker process.
    
-- EOF --
