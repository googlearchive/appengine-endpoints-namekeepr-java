## Project
####Metadata
* Version: 1.0 April 2013
* Author: Daniel Acton (http://plus.ly/daniel.acton)
* For any comments, queries or suggestions, feel free to contact Daniel Acton

####Description
Namekeepr is a simple web application that is based on Google App Engine and shows a variety of concepts:
* Google Cloud Endpoints;
* Datastore;
* Blobstore;
* Image Service;
* HTML5;
* WebGL;
* CSS3; and
* Responsive Design.

The application is aimed at developers wishing to start using Google App Engine. There is a running instance at http://namekeepr.appspot.com. To use this source code, download it, modify it (as you wish) and deploy to your own Google App Engine instance.

## Project Setup, Installation, and Configuration
All information about Google App Engine projects, e.g. building and running are available at https://developers.google.com/appengine.

The source code for this app is an Eclipse Project, so it's easiest to get started using Eclipse. If you don't want to use Eclipse, there are plenty command-line tools available to build and run the app.
See the application running in the real-world: http://namekeepr.appspot.com

To get the source code, execute these commands in a working directory of your
choice:
git clone https://github.com/GoogleCloudPlatform/appengine-endpoints-namekeepr-java
git submodule init

#### Getting started
* Install Java on your development environment so that it can be executed form the commandline 
* Install Eclipse (http://www.eclipse.org)
* Install the Google Eclipse Plugin with the Google App Engine SDK Plugin (https://developers.google.com/appengine/docs/java/tools/eclipse)
* Create a new Google Web Application project in Eclipse using this source code as the contents of the project

## Deploying
####Running locally
* Generate the cloud endpoints (https://developers.google.com/appengine/docs/java/endpoints/gen_clients)
* Run the script build.sh to generate the code for the templates
* Run the project as a Web Application

####Deploying to Google App Engine
* Follow instructions here: https://developers.google.com/appengine/docs/java/gettingstarted/uploading
* Sign in using your Google Account
* Create your own Google App Engine account (https://appengine.google.com)
* Create an application in the Google App Engine console (https://appengine.google.com), named something unique
* Change the name of the application in war/WEB-INF/appengine-web.xml and war/WEB-INF/web.xml to the name of the application you just set up in Google App Engine
* In Eclipse, after you've generated Cloud Endpoints and run build.sh, right-click on your project and select "Deploy to Google App Engine"

### How to setup the deployment environment
When you create a new Web Application in Eclipse, it will configure your libraries for you. However there are some libraries you will need to download and include yourself. 

####Gson
You will need to add the gson.jar from https://code.google.com/p/google-gson/ to the war/WEB-INF/lib directory. You will also need to add this library to your Eclipse build path.

####Google Closure Templates
The build.sh script uses the Google Closure compiler. Download it from here: https://code.google.com/p/closure-compiler/. Copy the file SoyToJsSrcCompiler.jar into the lib/ directory of the project.

## Contributing changes

* See CONTRIB.md

## Licensing

* See LICENSE
