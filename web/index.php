<?php

try {
    $dbh = new PDO('mysql:host=localhost;dbname=devicer;charset=utf8', 'devicer', 'devicer');
    $dbh->query('SET NAMES UTF-8');
} catch (PDOException $e) {
    print "Error!: " . $e->getMessage() . "<br/>";
    die();
}

require_once __DIR__.'/../vendor/autoload.php';
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;

$app = new Silex\Application();
$app['debug'] = true;
$app['dbh'] = $dbh;
$app->register(new Silex\Provider\TwigServiceProvider(), array(
    'twig.path' => __DIR__.'/../views',
));

$app->get('/', function() use($app) {
    $locations = array();
    $sth = $app['dbh']->prepare("SELECT id, title, num FROM devices WHERE location_id = :location_id");
    foreach ($app['dbh']->query("SELECT * FROM locations") as $l) {
        $sth->execute(array(':location_id' => $l['id']));
        $l['devices'] = $sth->fetchAll(PDO::FETCH_OBJ);
        $locations[] = $l;
    }
    return $app['twig']->render('index.html.twig', array(
        'locations' => json_encode($locations),
        'locationsRaw' => $locations
    ));
});


$app->post('/location', function(Request $request) use($app) {
    $sth = $app['dbh']->prepare("INSERT INTO locations(title, address) VALUES(:title, :address)");
    $sth->execute(array(':title' => $request->get('title'), ':address' => $request->get('address')));
    return $app->redirect('/');
});

$app->post('/device', function(Request $request) use($app) {
    $sth = $app['dbh']->prepare("INSERT INTO devices(title, num, location_id) VALUES(:title, :num, :location_id)");
    $sth->execute(array(
        ':title' => $request->get('title'),
        ':num' => $request->get('num'),
        ':location_id' => $request->get('location_id')
    ));
    return $app->redirect('/');
});

$app->run();
