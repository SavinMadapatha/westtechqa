<?php
defined('BASEPATH') OR exit('No direct script access allowed');
?><!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="utf-8">
	<title>Register</title>
    <link href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css" rel="stylesheet">
    <style>
        /* Similar styling as LoginView for consistency */
        body, html {
            height: 100%;
            background-color: #f5f5f5;
        }

        .content-center {
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
        }

        .benefits, .register-form {
            flex: 1; /* Take up equal width */
            max-width: 50%; /* Each takes up half of the container */
            margin: 20px; /* Spacing between them */
        }

        /* Adjustments as needed for smaller screens */
        @media (max-width: 768px) {
            .benefits, .register-form {
                max-width: 100%;
                flex: none;
            }
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

    <!-- register form -->
    <div class="content-center container">
            <div class="benefits">
                <h3>Key Benefits</h3>
                <ul>
                    <li>Benefit 1: Description</li>
                    <li>Benefit 2: Description</li>
                    <li>Benefit 3: Description</li>
                </ul>
            </div>
            <div class="register-form">
                <h2>Register</h2>
                <form action="<?php echo site_url('AuthController/register'); ?>" method="post">
                    <div class="form-group">
                        <label for="inputEmail">Email address</label>
                        <input type="email" class="form-control" id="inputEmail" name="email" required>
                    </div>
                    <div class="form-group">
                        <label for="inputUsername">Username</label>
                        <input type="text" class="form-control" id="inputUsername" name="username" required>
                    </div>
                    <div class="form-group">
                        <label for="inputPassword">Password</label>
                        <input type="password" class="form-control" id="inputPassword" name="password" required>
                    </div>
                    <button type="submit" class="btn btn-primary">Register</button>
                </form>
            </div>
        </div>
</body>
</html>
