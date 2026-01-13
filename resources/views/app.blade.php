<!DOCTYPE html>
<html  lang="en">

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <style>
        body {
            min-height: 100vh;
            background-image:
                linear-gradient(to bottom,
                    rgba(0, 0, 0, 0.9),
                    rgba(18, 48, 44, 0.9) 60%,
                    rgba(37, 95, 87, 0.9)),
                url('/storage/images/backgrounds/background.jpg');
            background-size: cover;
            background-position: center;
            background-attachment: fixed;
            background-repeat: no-repeat;
            overflow: hidden;
        }

        .poppins-thin {
            font-family: "Montserrat", sans-serif;
            font-weight: 100;
            font-style: normal;
        }

        .poppins-extralight {
            font-family: "Montserrat", sans-serif;
            font-weight: 200;
            font-style: normal;
        }

        .poppins-light {
            font-family: "Montserrat", sans-serif;
            font-weight: 300;
            font-style: normal;
        }

        .poppins-regular {
            font-family: "Montserrat", sans-serif;
            font-weight: 400;
            font-style: normal;
        }

        .poppins-medium {
            font-family: "Montserrat", sans-serif;
            font-weight: 500;
            font-style: normal;
        }

        .poppins-semibold {
            font-family: "Montserrat", sans-serif;
            font-weight: 600;
            font-style: normal;
        }

        .poppins-bold {
            font-family: "Montserrat", sans-serif;
            font-weight: 700;
            font-style: normal;
        }

        .poppins-extrabold {
            font-family: "Montserrat", sans-serif;
            font-weight: 800;
            font-style: normal;
        }

        :root {
            --toastify-icon-color-success: #0ccfbf;
        }

        .Toastify__toast-theme--dark {
            --toastify-color-progress-dark: #0ccfbf;
            --toastify-color-success: #000000;
            --toastify-icon-color-success: #0ccfbf;
            --toastify-toast-background: #000000;
            --toastify-text-color-light: #f1f1f1 ;
        }

        .ck-editor__editable {
            min-height: 200px;
            background-color: rgba(255, 255, 255, 0.486) !important;
        }
    </style>


    <title inertia>{{ config('app.name', 'Laravel') }}</title>

    <link rel="icon" href="/favicon.ico" sizes="any">
    <link rel="icon" href="/favicon.svg" type="image/svg+xml">
    <link rel="apple-touch-icon" href="/apple-touch-icon.png">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link
        href="https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,100..900;1,100..900&family=Open+Sans:ital,wght@0,300..800;1,300..800&display=swap"
        rel="stylesheet">

    @viteReactRefresh
    @vite(['resources/js/app.tsx', "resources/js/pages/{$page['component']}.tsx"])
    @inertiaHead

</head>

<body class="poppins-regular">
    <div class="stars"></div>
    @inertia
</body>

</html>
