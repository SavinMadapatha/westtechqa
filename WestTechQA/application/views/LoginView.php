<?php
defined('BASEPATH') OR exit('No direct script access allowed');
?><!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="utf-8">
	<title>Login</title>
    <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css">
    <style>
        html, body {
            height: 100%;
            background-color: #f5f5f5;
        }

        body {
            padding-top: 40px;
            padding-bottom: 40px;
            background-color: #f5f5f5;
            overflow: hidden; /* Prevents scrolling */
        }

        .navbar {
            height: 50px;
            background-color: white; 
            box-shadow: 0 2px 4px rgba(0,0,0,.04);
        }

        .navbar-content {
            margin-right: 40px;
            margin-left: 40px;
        }

        .logo {
            width: 80px;
            margin-bottom: 20px;
        }

        .logo-center {
            width: 50px;
            height: 50px;
            display: flex;
            border-radius: 25px;
            align-content: center;
            margin-bottom: 20px; 
        }

        .form-label {
            display: block;
            margin-top: .5rem;
            margin-bottom: .5rem;
        }

        .form-container {
            display: flex;
            min-height: 80vh; /* Adjust height calculation based on your navbar and padding */
            align-items: center;
            justify-content: center;
        }

        .form-signin {
            width: 100%;
            max-width: 330px;
            padding: 15px;
            margin: auto;
            background-color: #fff;
            border-radius: 5px;
            box-shadow: 0 4px 6px rgba(0,0,0,.1);
        }

        .form-signin .checkbox {
            font-weight: 400;
        }

        .form-signin .form-control:focus {
            z-index: 2;
        }

        .register-prompt {
            text-align: center;
        }
    </style>
</head>
<body>
    <!-- Navigation Bar -->
    <nav class="navbar navbar-expand-lg navbar-light fixed-top">
        <div class="container-fluid navbar-content">
            <a class="navbar-brand" href="#">
                <img src="websitelogo.png" width="150" height="38" class="d-inline-block align-top" alt="Your Logo">
            </a>
            <div class="collapse navbar-collapse justify-content-end">
                <ul class="navbar-nav">
                    <li class="nav-item">
                        <a class="nav-link" href="<?php echo site_url('ControllerName/AboutMethodName'); ?>">About</a>
                    </li>
                </ul>
            </div>
        </div>
    </nav>



    <!-- login form container to center form -->
    <div class="form-container">
        <div class="form-signin">
            <img class="logo-center" src="uni_logo.png" alt="Website Logo">
            <form action="<?php echo site_url('AuthController/login'); ?>" method="post">
                <label for="inputEmail" class="form-label">Email address</label>
                <input type="email" id="inputEmail" name="email" class="form-control" required autofocus>

                <label for="inputPassword" class="form-label">Password</label>
                <input type="password" id="inputPassword" name="password" class="form-control" required>

                <div class="checkbox mb-3">
                    <label>
                        <input type="checkbox" value="remember-me"> Remember me
                    </label>
                </div>
                <button class="btn btn-lg btn-primary btn-block" type="submit">Log in</button>
            </form>
        </div>
    </div>

    <!-- Registration prompt below the form -->
    <div class="register-prompt">
        <p>Don’t have an account? <a href="<?php echo site_url('AuthController/register'); ?>">Register now</a></p>
    </div>

    <!-- Include Bootstrap JS and jQuery -->
    <script src="https://code.jquery.com/jquery-3.5.1.slim.min.js"></script>
    <script src="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/js/bootstrap.bundle.min.js"></script>
</body>