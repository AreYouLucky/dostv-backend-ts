<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}" @class(['dark' => ($appearance ?? 'system') == 'dark'])>

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <script>
        (function() {
            const appearance = '{{ $appearance ?? 'system' }}';

            if (appearance === 'system') {
                const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

                if (prefersDark) {
                    document.documentElement.classList.add('dark');
                }
            }
        })();
    </script>
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

        .stars {
            position: fixed;
            inset: 0;
            pointer-events: none;
            z-index: 0;
        }

        .stars::after {
            content: "";
            position: absolute;
            width: 1px;
            height: 2px;
            background: white;
            box-shadow: 8vw 12vh 2px white, 16vw 18vh 1px white, 24vw 25vh 2px white,
                33vw 15vh 1px white, 41vw 28vh 2px white, 49vw 35vh 1px white,
                57vw 22vh 2px white, 65vw 42vh 1px white, 73vw 28vh 2px white,
                81vw 48vh 1px white, 89vw 32vh 2px white, 97vw 45vh 1px white,
                3vw 68vh 2px white, 11vw 75vh 1px white, 19vw 82vh 2px white,
                27vw 88vh 1px white, 35vw 72vh 2px white, 43vw 85vh 1px white,
                51vw 92vh 2px white, 59vw 78vh 1px white;
            animation: twinkle 6s infinite linear reverse;
        }

        html.dark body {
            background-image:
                linear-gradient(to bottom,
                    rgba(0, 0, 0, 0.8),
                    rgba(10, 25, 23, 0.8) 60%,
                    rgba(20, 50, 46, 0.8)),
                url('/storage/images/backgrounds/background.jpg');
            );
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
            /* optional global fallback */
            --toastify-icon-color-success: #0ccfbf;
        }

        .Toastify__toast-theme--dark {
            --toastify-color-progress-dark: #0ccfbf;
            --toastify-color-success: #000000;
            /* success border color */
            --toastify-icon-color-success: #0ccfbf;
            --toastify-toast-background: #000000;
            --toastify-text-color-light: #f1f1f1;
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

<body class="">
    <div class="stars"></div>
    @inertia
</body>

</html>
