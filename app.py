from flask import Flask, jsonify, request
from flask_cors import CORS
import mysql.connector

app = Flask(__name__)
CORS(app)  # Habilitar CORS para permitir solicitudes desde Angular

# Configuración de la base de datos
db_config = {
    "host": "localhost",
    "user": "root",
    "password": "114296",
    "database": "Tienda"
}

# ---------------- Rutas para Productos ---------------- #

# Obtener todos los productos
@app.route('/productos', methods=['GET'])
def get_productos():
    connection = mysql.connector.connect(**db_config)
    cursor = connection.cursor(dictionary=True)
    cursor.execute("SELECT * FROM productos")
    productos = cursor.fetchall()
    cursor.close()
    connection.close()
    return jsonify(productos)

# Obtener un producto por ID
@app.route('/productos/<int:id>', methods=['GET'])
def get_producto(id):
    connection = mysql.connector.connect(**db_config)
    cursor = connection.cursor(dictionary=True)
    query = "SELECT * FROM productos WHERE id_celular = %s"
    cursor.execute(query, (id,))
    producto = cursor.fetchone()
    cursor.close()
    connection.close()
    
    if producto:
        return jsonify(producto), 200
    else:
        return jsonify({"message": "Producto no encontrado"}), 404
    
# Crear un nuevo producto
@app.route('/productos', methods=['POST'])
def create_producto():
    data = request.json
    print("infotmacion: ", data)
    connection = mysql.connector.connect(**db_config)
    cursor = connection.cursor()
    query = "INSERT INTO productos (nombre, informacio, precio, marca) VALUES (%s, %s, %s, %s)"
    cursor.execute(query, (data['nombre'], data['informacio'], data['precio'], data['marca']))
    connection.commit()
    new_id = cursor.lastrowid
    cursor.close()
    connection.close()
    return jsonify({"id": new_id, **data}), 201

# Actualizar un producto
@app.route('/productos/<int:id>', methods=['PUT'])
def update_producto(id):
    data = request.json
    connection = mysql.connector.connect(**db_config)
    cursor = connection.cursor()
    query = "UPDATE productos SET nombre = %s, informacio = %s, precio = %s, marca = %s WHERE id_celular = %s"
    cursor.execute(query, (data['nombre'], data['informacio'], data['precio'], data['marca'], id))
    connection.commit()
    cursor.close()
    connection.close()
    return jsonify({"message": "Producto actualizado"}), 200

# Eliminar un producto
@app.route('/productos/<int:id>', methods=['DELETE'])
def delete_producto(id):
    connection = mysql.connector.connect(**db_config)
    cursor = connection.cursor()
    query = "DELETE FROM productos WHERE id_celular = %s"
    cursor.execute(query, (id,))
    connection.commit()
    cursor.close()
    connection.close()
    return jsonify({"message": "Producto eliminado"}), 200

# ---------------- Rutas para Crédito ---------------- #

# Obtener todas las tarjetas de crédito
@app.route('/credito', methods=['GET'])
def get_creditos():
    connection = mysql.connector.connect(**db_config)
    cursor = connection.cursor(dictionary=True)
    cursor.execute("SELECT * FROM credito")
    creditos = cursor.fetchall()
    cursor.close()
    connection.close()
    return jsonify(creditos)

# Obtener un crédito por ID
@app.route('/credito/<int:id>', methods=['GET'])
def get_credito(id):
    connection = mysql.connector.connect(**db_config)
    cursor = connection.cursor(dictionary=True)
    query = "SELECT * FROM credito WHERE card_id = %s"
    cursor.execute(query, (id,))
    credito = cursor.fetchone()
    cursor.close()
    connection.close()
    
    if credito:
        return jsonify(credito), 200
    else:
        return jsonify({"message": "Crédito no encontrado"}), 404

# Mostrar el último registro
@app.route('/credito/ultimo', methods=['GET'])
def get_ultimo_credito():
    connection = mysql.connector.connect(**db_config)
    cursor = connection.cursor(dictionary=True)
    query = "SELECT * FROM credito ORDER BY card_id DESC LIMIT 1"
    cursor.execute(query)
    ultimo_credito = cursor.fetchone()
    cursor.close()
    connection.close()

    if ultimo_credito:
        return jsonify(ultimo_credito), 200
    else:
        return jsonify({"message": "No se encontraron registros"}), 404

# Crear una nueva tarjeta de crédito
@app.route('/credito', methods=['POST'])
def create_credito():
    data = request.json
    connection = mysql.connector.connect(**db_config)
    cursor = connection.cursor()
    query = """
    INSERT INTO credito (card_holder_name, card_number, cvv, valor, expiration_date, informacion)
    VALUES (%s, %s, %s, %s, %s,%s)
    """
    try:
        # Ejecutar la consulta con los valores proporcionados en el cuerpo de la solicitud
        cursor.execute(query, (
            data['card_holder_name'], 
            data['card_number'], 
            data['cvv'], 
            data['valor'], 
            data['expiration_date'],
            data['informacion']
        ))
        connection.commit()
        new_id = cursor.lastrowid
        return jsonify({"card_id": new_id, **data}), 201
    except mysql.connector.Error as err:
        # Manejo de errores de MySQL
        return jsonify({"error": str(err)}), 400
    finally:
        # Asegurarse de cerrar la conexión
        cursor.close()
        connection.close()


# Actualizar una tarjeta de crédito
@app.route('/credito/<int:card_id>', methods=['PUT'])
def update_credito(card_id):
    data = request.json
    connection = mysql.connector.connect(**db_config)
    cursor = connection.cursor()
    query = """
        UPDATE credito
        SET card_holder_name = %s, card_number = %s, expiration_date = %s, cvv = %s, valor = %s, cantidad = %s
        WHERE card_id = %s
    """
    cursor.execute(query, (data['card_holder_name'], data['card_number'], data['expiration_date'], data['cvv'], data['valor'], data['cantidad'], card_id))
    connection.commit()
    cursor.close()
    connection.close()
    return jsonify({"message": "Tarjeta de crédito actualizada"}), 200

# Eliminar una tarjeta de crédito
@app.route('/credito/<int:card_id>', methods=['DELETE'])
def delete_credito(card_id):
    connection = mysql.connector.connect(**db_config)
    cursor = connection.cursor()
    query = "DELETE FROM credito WHERE card_id = %s"
    cursor.execute(query, (card_id,))
    connection.commit()
    cursor.close()
    connection.close()
    return jsonify({"message": "Tarjeta de crédito eliminada"}), 200

if __name__ == '__main__':
    app.run(port=5000, debug=True)
