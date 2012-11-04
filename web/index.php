<?php

require_once __DIR__.'/../vendor/autoload.php';
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;

$app = new Silex\Application();
$app['debug'] = true;
$app->register(new Silex\Provider\TwigServiceProvider(), array(
    'twig.path' => __DIR__.'/../views',
));

$app->get('/', function() use($app) {
    return $app['twig']->render('index.html.twig', array());
});

$app->get('/admin', function() use($app) {
    $content = file_get_contents(__DIR__.'/views/admin.html');
    return new Response($content);
});


$app->run();
