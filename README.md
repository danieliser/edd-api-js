This is a simplified JavaScript wrapper for the Easy Digital Downloads Rest API.

It currently requires adding extra headers to the api requests if your using it from a remote server in order to support CORS.

There are multiple query methods already, each returns valid results in the form of objects or null.

Check out the following sample code to get you started. Read the Easy Digital Downloads [API Reference](http://docs.easydigitaldownloads.com/category/1130-api-reference) for more information on how to obtain keys and tokens.

#### Usage

##### Load the sdk.

    <script type="text/javascript" src="edd-api.js"></script>

##### Call a reusable instance.

    var my_edd_api = new EDD_API( {
        url: 'https://example.com/edd-api/v2/',
        key: 'your_key_here',
        token: 'your_token_here'
    } );

##### Test it.
Use it the same way you do the PHP version. Currently it doesn't include any models though, pure json objects.

    my_edd_api.get_customer('valid@purchase-email.com', {}, function (customer) {
        if (!customer) {
            console.log('no customer found');
        } else {
            console.log(customer.info.display_name + " has spent $" + customer.stats.total_spent);
        }
    });
    
    
### CORS Headers

The needed headers look something like this. Temporary solution is to add them to the top of the EDD_API::output() function near `easy-digital-downloads/includes/api/class-edd-api.php:1880`.

    header('Access-Control-Allow-Origin: *');
    header('Access-Control-Allow-Methods: GET, POST');
    header("Access-Control-Allow-Headers: X-Requested-With");

    // Optional** Access-Control headers are received during OPTIONS requests
    if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
        if (isset($_SERVER['HTTP_ACCESS_CONTROL_REQUEST_METHOD']) && $_SERVER['HTTP_ACCESS_CONTROL_REQUEST_METHOD'] == 'POST') {
            header('Access-Control-Allow-Origin: *');
            header('Access-Control-Allow-Headers: X-Requested-With, content-type, access-control-allow-origin, access-control-allow-methods, access-control-allow-headers');
        }
        exit;
    }
    
I have a ticket in to get these added as an option via EDD Settings.