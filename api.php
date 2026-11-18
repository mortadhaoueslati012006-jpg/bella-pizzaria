<?php
// Database connection
$host = "localhost";
$username = "root";
$password = "";
$database = "pizzeria1_db";

$conn = mysqli_connect($host, $username, $password, $database);

// Définir l'encodage UTF-8 (compatible avec les anciennes versions de MySQL)
if ($conn) {
    mysqli_set_charset($conn, "utf8");
}

if (!$conn) {
    die(json_encode(['error' => 'Connection failed: ' . mysqli_connect_error()]));
}

header('Content-Type: application/json; charset=utf-8');

// Get the action from the request
$action = isset($_POST['action']) ? $_POST['action'] : '';

switch ($action) {
    case 'login_client':
        loginClient();
        break;
    case 'login_admin':
        loginAdmin();
        break;
    case 'register_client':
        registerClient();
        break;
    case 'get_menu':
        getMenu();
        break;
    case 'add_pizza':
        addPizza();
        break;
    case 'update_pizza':
        updatePizza();
        break;
    case 'delete_pizza':
        deletePizza();
        break;
    case 'place_order':
        placeOrder();
        break;
    case 'get_orders':
        getOrders();
        break;
    case 'get_order_history':
        getOrderHistory();
        break;
    case 'validate_promo':
        validatePromo();
        break;
    case 'get_stats':
        getStats();
        break;
    case 'get_promo_codes':
        getPromoCodes();
        break;
    case 'update_promo':
        updatePromo();
        break;
    case 'delete_promo':
        deletePromo();
        break;
    case 'add_promo':
        addPromo();
        break;
    case 'get_users':
        getUsers();
        break;
    case 'delete_user':
        deleteUser();
        break;
    default:
        echo json_encode(['error' => 'Invalid action']);
}

function loginClient() {
    global $conn;
    $tel = mysqli_real_escape_string($conn, trim($_POST['tel']));
    $password = mysqli_real_escape_string($conn, trim($_POST['password']));
    
    $query = "SELECT * FROM clients WHERE tel='$tel' AND password='$password'";
    $result = mysqli_query($conn, $query);
    
    if ($result && mysqli_num_rows($result) > 0) {
        $client = mysqli_fetch_assoc($result);
        echo json_encode(['success' => true, 'user' => $client]);
    } else {
        echo json_encode(['success' => false, 'message' => 'Identifiants invalides']);
    }
}

function loginAdmin() {
    global $conn;
    $username = mysqli_real_escape_string($conn, trim($_POST['username']));
    $password = mysqli_real_escape_string($conn, trim($_POST['password']));
    
    $query = "SELECT * FROM admins WHERE username='$username' AND password='$password'";
    $result = mysqli_query($conn, $query);
    
    if ($result && mysqli_num_rows($result) > 0) {
        $admin = mysqli_fetch_assoc($result);
        echo json_encode(['success' => true, 'user' => $admin]);
    } else {
        echo json_encode(['success' => false, 'message' => 'Identifiants admin invalides']);
    }
}

function registerClient() {
    global $conn;
    $tel = mysqli_real_escape_string($conn, trim($_POST['tel']));
    $nom = mysqli_real_escape_string($conn, trim($_POST['nom']));
    $prenom = mysqli_real_escape_string($conn, trim($_POST['prenom']));
    $address = mysqli_real_escape_string($conn, trim($_POST['address']));
    $password = mysqli_real_escape_string($conn, trim($_POST['password']));
    
    // Vérifier si le numéro existe déjà
    $checkQuery = "SELECT * FROM clients WHERE tel='$tel'";
    $checkResult = mysqli_query($conn, $checkQuery);
    
    if ($checkResult && mysqli_num_rows($checkResult) > 0) {
        echo json_encode(['success' => false, 'message' => 'Numero de telephone deja enregistre']);
        return;
    }
    
    $query = "INSERT INTO clients (tel, nom, prenom, address, password) VALUES ('$tel', '$nom', '$prenom', '$address', '$password')";
    
    if (mysqli_query($conn, $query)) {
        echo json_encode(['success' => true, 'message' => 'Inscription reussie']);
    } else {
        echo json_encode(['success' => false, 'message' => 'Echec de l\'inscription: ' . mysqli_error($conn)]);
    }
}

function getMenu() {
    global $conn;
    $query = "SELECT * FROM pizzas ORDER BY category, name";
    $result = mysqli_query($conn, $query);
    
    $items = [];
    if ($result) {
        while ($row = mysqli_fetch_assoc($result)) {
            $items[] = $row;
        }
    }
    
    echo json_encode(['success' => true, 'items' => $items]);
}

function addPizza() {
    global $conn;
    $id = mysqli_real_escape_string($conn, $_POST['id']);
    $name = mysqli_real_escape_string($conn, $_POST['name']);
    $price = mysqli_real_escape_string($conn, $_POST['price']);
    $image = mysqli_real_escape_string($conn, $_POST['image']);
    $description = mysqli_real_escape_string($conn, $_POST['description']);
    $category = mysqli_real_escape_string($conn, $_POST['category']);
    
    $query = "INSERT INTO pizzas (id, name, price, image, description, category) VALUES ('$id', '$name', '$price', '$image', '$description', '$category')";
    
    if (mysqli_query($conn, $query)) {
        echo json_encode(['success' => true, 'message' => 'Article ajoute avec succes']);
    } else {
        echo json_encode(['success' => false, 'message' => 'Echec de l\'ajout']);
    }
}

function updatePizza() {
    global $conn;
    $id = mysqli_real_escape_string($conn, $_POST['id']);
    $name = mysqli_real_escape_string($conn, $_POST['name']);
    $price = mysqli_real_escape_string($conn, $_POST['price']);
    $description = mysqli_real_escape_string($conn, $_POST['description']);
    
    $query = "UPDATE pizzas SET name='$name', price='$price', description='$description' WHERE id='$id'";
    
    if (mysqli_query($conn, $query)) {
        echo json_encode(['success' => true, 'message' => 'Article mis a jour avec succes']);
    } else {
        echo json_encode(['success' => false, 'message' => 'Echec de la mise a jour']);
    }
}

function deletePizza() {
    global $conn;
    $id = mysqli_real_escape_string($conn, $_POST['id']);
    
    $query = "DELETE FROM pizzas WHERE id='$id'";
    
    if (mysqli_query($conn, $query)) {
        echo json_encode(['success' => true, 'message' => 'Article supprime avec succes']);
    } else {
        echo json_encode(['success' => false, 'message' => 'Echec de la suppression']);
    }
}

function placeOrder() {
    global $conn;
    $tel = mysqli_real_escape_string($conn, $_POST['tel']);
    $items = $_POST['items'];
    $total = mysqli_real_escape_string($conn, $_POST['total']);
    $deliveryType = mysqli_real_escape_string($conn, $_POST['deliveryType']);
    $deliveryAddress = mysqli_real_escape_string($conn, $_POST['deliveryAddress']);
    $promoCode = mysqli_real_escape_string($conn, $_POST['promoCode']);
    $discountAmount = mysqli_real_escape_string($conn, $_POST['discountAmount']);
    
    $query = "INSERT INTO orders (tel, items, total, delivery_type, delivery_address, promo_code, discount_amount) 
              VALUES ('$tel', '" . mysqli_real_escape_string($conn, $items) . "', '$total', '$deliveryType', '$deliveryAddress', '$promoCode', '$discountAmount')";
    
    if (mysqli_query($conn, $query)) {
        echo json_encode(['success' => true, 'message' => 'Commande passee avec succes']);
    } else {
        echo json_encode(['success' => false, 'message' => 'Echec de la commande: ' . mysqli_error($conn)]);
    }
}

function getOrders() {
    global $conn;
    $query = "SELECT o.*, c.nom, c.prenom FROM orders o 
              JOIN clients c ON o.tel = c.tel 
              ORDER BY o.order_date DESC";
    $result = mysqli_query($conn, $query);
    
    $orders = [];
    if ($result) {
        while ($row = mysqli_fetch_assoc($result)) {
            $orders[] = $row;
        }
    }
    
    echo json_encode(['success' => true, 'orders' => $orders]);
}

function getOrderHistory() {
    global $conn;
    $tel = mysqli_real_escape_string($conn, $_POST['tel']);
    
    $query = "SELECT * FROM orders WHERE tel='$tel' ORDER BY order_date DESC";
    $result = mysqli_query($conn, $query);
    
    $orders = [];
    if ($result) {
        while ($row = mysqli_fetch_assoc($result)) {
            $orders[] = $row;
        }
    }
    
    echo json_encode(['success' => true, 'orders' => $orders]);
}

function validatePromo() {
    global $conn;
    $code = mysqli_real_escape_string($conn, $_POST['code']);
    
    $query = "SELECT * FROM promo_codes WHERE code='$code' AND active=1";
    $result = mysqli_query($conn, $query);
    
    if ($result && mysqli_num_rows($result) > 0) {
        $promo = mysqli_fetch_assoc($result);
        echo json_encode(['success' => true, 'discount' => $promo['discount_percentage']]);
    } else {
        echo json_encode(['success' => false, 'message' => 'Code promo invalide']);
    }
}

function getStats() {
    global $conn;
    
    // Today's sales
    $todayQuery = "SELECT SUM(total) as total, COUNT(*) as count FROM orders WHERE DATE(order_date) = CURDATE()";
    $todayResult = mysqli_query($conn, $todayQuery);
    $todayStats = mysqli_fetch_assoc($todayResult);
    
    // Monthly sales
    $monthQuery = "SELECT SUM(total) as total, COUNT(*) as count FROM orders WHERE MONTH(order_date) = MONTH(CURDATE()) AND YEAR(order_date) = YEAR(CURDATE())";
    $monthResult = mysqli_query($conn, $monthQuery);
    $monthStats = mysqli_fetch_assoc($monthResult);
    
    // Yearly sales
    $yearQuery = "SELECT SUM(total) as total, COUNT(*) as count FROM orders WHERE YEAR(order_date) = YEAR(CURDATE())";
    $yearResult = mysqli_query($conn, $yearQuery);
    $yearStats = mysqli_fetch_assoc($yearResult);
    
    // Top pizzas today
    $topTodayQuery = "SELECT items FROM orders WHERE DATE(order_date) = CURDATE()";
    $topTodayResult = mysqli_query($conn, $topTodayQuery);
    $topToday = calculateTopPizzas($topTodayResult);
    
    // Top pizzas this month
    $topMonthQuery = "SELECT items FROM orders WHERE MONTH(order_date) = MONTH(CURDATE()) AND YEAR(order_date) = YEAR(CURDATE())";
    $topMonthResult = mysqli_query($conn, $topMonthQuery);
    $topMonth = calculateTopPizzas($topMonthResult);
    
    // Top pizzas this year
    $topYearQuery = "SELECT items FROM orders WHERE YEAR(order_date) = YEAR(CURDATE())";
    $topYearResult = mysqli_query($conn, $topYearQuery);
    $topYear = calculateTopPizzas($topYearResult);
    
    echo json_encode([
        'success' => true,
        'today' => $todayStats,
        'month' => $monthStats,
        'year' => $yearStats,
        'topToday' => $topToday,
        'topMonth' => $topMonth,
        'topYear' => $topYear
    ]);
}

function calculateTopPizzas($result) {
    $pizzaCount = [];
    
    if ($result) {
        while ($row = mysqli_fetch_assoc($result)) {
            $items = json_decode($row['items'], true);
            if ($items) {
                foreach ($items as $item) {
                    if ($item['category'] === 'pizza') {
                        $name = $item['name'];
                        if (!isset($pizzaCount[$name])) {
                            $pizzaCount[$name] = 0;
                        }
                        $pizzaCount[$name] += $item['quantity'];
                    }
                }
            }
        }
    }
    
    arsort($pizzaCount);
    return array_slice($pizzaCount, 0, 3, true);
}

function getPromoCodes() {
    global $conn;
    $query = "SELECT * FROM promo_codes ORDER BY discount_percentage DESC";
    $result = mysqli_query($conn, $query);
    
    $promos = [];
    if ($result) {
        while ($row = mysqli_fetch_assoc($result)) {
            $promos[] = $row;
        }
    }
    
    echo json_encode(['success' => true, 'promos' => $promos]);
}

function updatePromo() {
    global $conn;
    $id = mysqli_real_escape_string($conn, $_POST['id']);
    $active = mysqli_real_escape_string($conn, $_POST['active']);
    
    $query = "UPDATE promo_codes SET active='$active' WHERE id='$id'";
    
    if (mysqli_query($conn, $query)) {
        echo json_encode(['success' => true, 'message' => 'Code promo mis a jour']);
    } else {
        echo json_encode(['success' => false, 'message' => 'Echec de la mise a jour']);
    }
}

function deletePromo() {
    global $conn;
    $id = mysqli_real_escape_string($conn, $_POST['id']);
    
    $query = "DELETE FROM promo_codes WHERE id='$id'";
    
    if (mysqli_query($conn, $query)) {
        echo json_encode(['success' => true, 'message' => 'Code promo supprime']);
    } else {
        echo json_encode(['success' => false, 'message' => 'Echec de la suppression']);
    }
}

function addPromo() {
    global $conn;
    $code = mysqli_real_escape_string($conn, $_POST['code']);
    $discount = mysqli_real_escape_string($conn, $_POST['discount']);
    
    $query = "INSERT INTO promo_codes (code, discount_percentage, active) VALUES ('$code', '$discount', 1)";
    
    if (mysqli_query($conn, $query)) {
        echo json_encode(['success' => true, 'message' => 'Code promo ajoute']);
    } else {
        echo json_encode(['success' => false, 'message' => 'Echec de l\'ajout']);
    }
}

function getUsers() {
    global $conn;
    $query = "SELECT tel, nom, prenom, address, created_at FROM clients ORDER BY created_at DESC";
    $result = mysqli_query($conn, $query);
    
    $users = [];
    if ($result) {
        while ($row = mysqli_fetch_assoc($result)) {
            $users[] = $row;
        }
    }
    
    echo json_encode(['success' => true, 'users' => $users]);
}

function deleteUser() {
    global $conn;
    $tel = mysqli_real_escape_string($conn, $_POST['tel']);
    
    // Delete user's orders first
    $deleteOrdersQuery = "DELETE FROM orders WHERE tel='$tel'";
    mysqli_query($conn, $deleteOrdersQuery);
    
    // Delete user
    $query = "DELETE FROM clients WHERE tel='$tel'";
    
    if (mysqli_query($conn, $query)) {
        echo json_encode(['success' => true, 'message' => 'Utilisateur supprime']);
    } else {
        echo json_encode(['success' => false, 'message' => 'Echec de la suppression']);
    }
}

mysqli_close($conn);
?>