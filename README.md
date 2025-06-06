# Forensic-Workspace

A comprehensive online workspace designed for forensic officers and crime investigators to store, organise, and manage their cases efficiently. Built with React and Firebase for secure, real-time data management.
For testing purposes, create a new account using the signup feature or contact the repository maintainer for demo credentials.
No user can log in without signing up; for easier use and immediate access with the given firebase credentials, this is the user's details:
#### name: Tanishta Varman 
#### ID: 203203456123  
#### Password: ABCD123@.

## Frontend :
- React.js
- React Router DOM
- Custom CSS
- React Icons
- Vite(tool and development server)

## Backend and Database :
- Firebase Authentication
- Cloud Firestore
- Firebase Storage 

## Core Functionality:

- User Authentication System - Login/logout with email and password
- Case Management - Create, view, and organise forensic cases
- Evidence Storage - Upload and manage evidence images
- Case Details Tracking - Store medical reports, forensic reports, timelines
- User Profile Management - Update user information
- Protected Routes - Secure access to sensitive case data

## Security Features:
- Authentication Required - Must log in to access the system
- Route Protection - Unauthorised users can't access case data

## Installation Steps

### Clone the repository:
- git clone https://github.com/YOUR_USERNAME/forensic-workspace.git
- cd forensic-workspace
### Install dependencies:
- npm install

## Firebase Configuration:
- The project comes pre-configured with Firebase for immediate testing. For production use:
1. Create your own Firebase project at Firebase Console
2. Enable Authentication (Email/Password)
3. Set up Cloud Firestore
4. Enable Firebase Storage
5. Replace the Firebase configuration in your project

## Usage
### Getting Started

- Sign Up/Login - Create an account or log in with existing credentials
- Dashboard - View your case overview and statistics
- Create Case - Add new forensic cases with detailed information
- Manage Evidence - Upload and organise evidence files
- Generate Reports - Create and export case reports

### Case Management

- Add New Cases - Click "New Case" to create a forensic case
- View Cases - Browse all your cases in an organised list
- Edit Cases - Update case information and add new evidence
- Delete Cases - Remove cases (with confirmation prompt)

