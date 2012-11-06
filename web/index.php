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
use Symfony\Component\HttpFoundation\JsonResponse;

$app = new Silex\Application();
$app['debug'] = true;
$app['dbh'] = $dbh;
$app->register(new Silex\Provider\TwigServiceProvider(), array(
    'twig.path' => __DIR__.'/../views',
));

$app->get('/', function() use($app) {
    $locations = array();
    $sth = $app['dbh']->prepare("SELECT id, title, num, location_id FROM devices WHERE location_id = :location_id");
    foreach ($app['dbh']->query("SELECT * FROM locations") as $l) {
        $sth->execute(array(':location_id' => $l['id']));
        $l['devices'] = $sth->fetchAll(PDO::FETCH_OBJ);
        $locations[] = $l;
    }
    return $app['twig']->render('index.html.twig', array(
        'locations' => json_encode($locations),
        'locationsRaw' => $locations,
        'firstLocationId' => $locations[0]['id']
    ));
});


// POST LOCATION
$app->post('/api/v1/locations', function(Request $request) use($app) {
    $sth = $app['dbh']->prepare("INSERT INTO locations(title, address) VALUES(:title, :address)");
    $sth->execute(array(':title' => $request->get('title'), ':address' => $request->get('address')));

    $errors = $sth->errorInfo();
    $status = array(
        'success' => (int)$errors[0] === 0 ? true : false,
        'message' => $errors[2],
        'method' => 'POST',
        //'data' => (string)$request->getQueryString()
    );

    return new JsonResponse($status);
});


// GET LOCATIONS IN JSON
$app->get('/locations', function() use ($app) {
    $locations = array();
    $sth = $app['dbh']->prepare("SELECT id, title, num, location_id FROM devices WHERE location_id = :location_id");
    foreach ($app['dbh']->query("SELECT * FROM locations") as $l) {
        $sth->execute(array(':location_id' => $l['id']));
        $l['devices'] = $sth->fetchAll(PDO::FETCH_OBJ);
        $locations[] = $l;
    }

    return new JsonResponse($locations);
});

// POST DEVICE
$app->post('/api/v1/devices', function(Request $request) use($app) {
    $sth = $app['dbh']->prepare("INSERT INTO devices(title, num, location_id) VALUES(:title, :num, :location_id)");
    $sth->execute(array(
        ':title' => $request->get('title'),
        ':num' => $request->get('num'),
        ':location_id' => $request->get('location_id')
    ));

    $errors = $sth->errorInfo();
    $status = array(
        'success' => (int)$errors[0] === 0 ? true : false,
        'message' => $errors[2],
        'method' => 'POST',
        //'data' => (string)$request->getQueryString()
    );

    return new JsonResponse($status);
});

// PUT DEVICE
$app->put('/api/v1/devices/{id}', function(Request $request, $id) use($app) {
    $sth = $app['dbh']->prepare("UPDATE devices SET title = :title, num = :num, location_id = :location_id WHERE id = :id");
    $sth->execute(array(
        ':title' => $request->get('title'),
        ':num' => $request->get('num'),
        ':location_id' => $request->get('location_id'),
        ':id' => $id
    ));

    $errors = $sth->errorInfo();

    $status = array(
        'success' => (int)$errors[0] === 0 ? true : false,
        'message' => $errors[2],
        'method' => 'PUT',
        //'data' => (string)$request->getQueryString()
    );

    return new JsonResponse($status);
});

// PUT LOCATION
$app->put('/api/v1/locations/{id}', function(Request $request, $id) use($app) {
    $sth = $app['dbh']->prepare("UPDATE locations SET title = :title, address = :address WHERE id = :id");
    $sth->execute(array(
        ':title' => $request->get('title'),
        ':address' => $request->get('address'),
        ':id' => $id
    ));

    $errors = $sth->errorInfo();
    $status = array(
        'success' => (int)$errors[0] === 0 ? true : false,
        'message' => $errors[2],
        'method' => 'PUT',
        //'data' => (string)$request->getQueryString()
    );

    return new JsonResponse($status);
});


// DELETE DEVICE
$app->delete('/api/v1/devices/{id}', function(Request $request, $id) use($app) {
    $sth = $app['dbh']->prepare("DELETE FROM devices WHERE id = :id");
    $sth->execute(array(
        ':id' => $id
    ));

    $errors = $sth->errorInfo();

    $status = array(
        'success' => (int)$errors[0] === 0 ? true : false,
        'message' => $errors[2],
        'method' => 'DELETE'
    );

    return new JsonResponse($status);
});


// DELETE LOCATION
$app->delete('/api/v1/locations/{id}', function(Request $request, $id) use($app) {
    $sth = $app['dbh']->prepare("DELETE FROM locations WHERE id = :id");
    $sth->execute(array(
        ':id' => $id
    ));

    $sth = $app['dbh']->prepare("DELETE FROM devices WHERE location_id = :id");
    $sth->execute(array(
        ':id' => $id
    ));

    $errors = $sth->errorInfo();
    $status = array(
        'success' => (int)$errors[0] === 0 ? true : false,
        'message' => $errors[2],
        'method' => 'DELETE'
    );

    return new JsonResponse($status);
});

// SEARCH
$app->get('/api/v1/devices', function(Request $request) use($app) {
    $filter = addslashes(mb_strtolower($request->get('filter'), 'UTF-8'));
    $sth = $app['dbh']->prepare("SELECT * FROM devices WHERE title LIKE '%{$filter}%' OR num LIKE '%{$filter}%'");
    $sth->execute(array());

    $errors = $sth->errorInfo();
    $status = array(
        'success' => (int)$errors[0] === 0 ? true : false,
        'message' => $errors[2],
        'method' => 'GET',
        'data' => $sth->fetchAll(PDO::FETCH_ASSOC)
    );

    return new JsonResponse($status);
});


$app->run();
