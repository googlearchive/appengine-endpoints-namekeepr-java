![status: inactive](https://img.shields.io/badge/status-inactive-red.svg)

This project is no longer actively developed or maintained.  

## Project
####Metadata
* Version: 1.0 April 2013
* Author: [Daniel Acton](http://plus.ly/daniel.acton)
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

The application is aimed at developers wishing to start using Google App Engine. There is a running instance [here](http://namekeepr.appspot.com). To use this source code, download it, modify it (as you wish) and deploy to your own Google App Engine instance.

## Project Setup, Installation, and Configuration
All information about Google App Engine projects, e.g. building and running are available online on the [Google App Engine developer site](https://developers.google.com/appengine).

The source code for this app is an Eclipse Project, so it's easiest to get started using Eclipse. If you don't want to use Eclipse, there are plenty command-line tools available to build and run the app.
See the application running in the real-world: [here](http://namekeepr.appspot.com)

To get the source code, execute these commands in a working directory of your choice:
>      git clone https://github.com/GoogleCloudPlatform/appengine-endpoints-namekeepr-java
>      cd appengine-endpoints-namekeepr-java
>      git submodule init
>      git submodule update

#### Getting started
* Install Java on your development environment so that it can be executed form the commandline
* Install Eclipse (download the Java version of Eclipse from the [Eclipse site](http://www.eclipse.org))
* Install the [Google Eclipse Plugin](https://developers.google.com/appengine/docs/java/tools/eclipse) - be sure to install the Google App Engine SDK option.
* Create a new Google Web Application project in Eclipse using this source code as the contents of the project
* Get the source code from the Github repository into a directory other than your Eclipse project directory, using these commands:
>        git clone https://github.com/GoogleCloudPlatform/appengine-endpoints-namekeepr-java
>        cd appengine-endpoints-namekeepr-java
>        git submodule init
>        git submodule update

* Copy the `build.sh` file and the `src/` and `war/` directories into your Eclipse project's directory and refresh in Eclipse
* The application uses Google Gson to manage JSON.
  *  Download `gson-version.zip` (where `version` is the latest version) from the [Google Gson project site](https://code.google.com/p/google-gson/)  
  *  From the zip file, extract `gson-version.jar` and copy it to the `war/WEB-INF/lib` directory of your Eclipse project.
  *  You will also need to add this library to your Eclipse build path
* The `build.sh` script uses the Google Closure Templates Javascript compiler.
  * Download `closure-templates-for-javascript-latest.zip` from the [Closure Compiler project site](https://code.google.com/p/closure-templates/). 
  * From the zip file, extract the files `SoyToJsSrcCompiler.jar` and `soyutils.js`
  * Create a directory `lib` in your Eclipse project (at the root) 
  * Copy the file `SoyToJsSrcCompiler.jar` into the `lib/` directory of your Eclipse project
  * Copy the file `soyutils.js` into the `war/js` directory of your Eclipse project

## Deploying
####Running locally
* Generate the Google Cloud Endpoints Client Library using [these instructions](https://developers.google.com/appengine/docs/java/endpoints/gen_clients)
* Run the script `build.sh` to generate the code for the templates
* Run the project as a Web Application

####Deploying to Google App Engine
* Consult [these instructions](https://developers.google.com/appengine/docs/java/gettingstarted/uploading)
* Sign in using your Google Account
* Create your own Google App Engine account using the [Google App Engine console](https://appengine.google.com)
* Create an application in the [Google App Engine console](https://appengine.google.com), named something unique
* Change the name of the application in `war/WEB-INF/appengine-web.xml` and `war/WEB-INF/web.xml` to the name of the application you just set up in Google App Engine
* Generate the Google Cloud Endpoints Client Library using [these instructions](https://developers.google.com/appengine/docs/java/endpoints/gen_clients)
* Run the script `build.sh` to generate the code for the templates
* Modify `war/index.html` and update the value of the ROOT variable so that your application points to the live server and not your localhost (where `yourappid` is the application name you chose above)
>     var ROOT = 'https://yourappid.appspot.com/_ah/api';

* In Eclipse, right-click on your project and select "Deploy to Google App Engine"

### How to setup the deployment environment
When you create a new Web Application in Eclipse, it will configure your libraries for you. However there are some libraries you will need to download and include yourself. These are Google Gson and Google Closure Templates. The instructions for using these in your project are included in the Getting Started portion of this README.

## Contributing changes

* See CONTRIB.md

## Licensing

* See LICENSE

