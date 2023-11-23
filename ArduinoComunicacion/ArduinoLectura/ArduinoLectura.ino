#include <SPI.h>
#include <MFRC522.h>
#include <ArduinoJson.h>

#define RST_PIN         13          
#define SS_PIN          5          

//Definicion de variables globales necesarias para la escritura y el lector MFRC

MFRC522 mfrc522(SS_PIN, RST_PIN);   
const int TAMANO_BUFFER = 200;
String jsonString;
boolean mensajePendiente = false;
byte buffer[16];
byte bufferEntrada[18];

void setup() {
  Serial.begin(9600);
  SPI.begin();
  mfrc522.PCD_Init();
}

void loop() {
  

  if (Serial.available() > 0 && mensajePendiente == false) { //Analiza bytes entrantes. No es el caso para la lectura de la tarjeta

    char jsonBuffer[TAMANO_BUFFER];
    int bytesRead = Serial.readBytesUntil('\n', jsonBuffer, TAMANO_BUFFER);
    jsonBuffer[bytesRead] = '\0';

    StaticJsonDocument<TAMANO_BUFFER> doc;
    DeserializationError error = deserializeJson(doc, jsonBuffer);

    if (error) {
      Serial.print("Error al parsear JSON: ");
      Serial.println(error.c_str());
    } else {
      SPI.begin();
      mfrc522.PCD_Init();
      mensajePendiente = true;
      serializeJson(doc, jsonString);      
      delay(4);

    }
  }

  
  if ( mfrc522.PICC_IsNewCardPresent() && mfrc522.PICC_ReadCardSerial() && mensajePendiente == false){ //COMO NO HAY MENSAJE PENDIENTE, AL ACERCAR LA TARJETA, SE LEE SU CONTENIDO
    
    MFRC522::MIFARE_Key key;
    
    // Clave de ejemplo, deberías conocer la clave correcta para el sector
    // La clave A y la clave B son de 6 bytes cada una
    for (byte i = 0; i < 6; i++) {
      key.keyByte[i] = 0xFF;  // Clave de ejemplo, deberías conocer la clave correcta
    }


    //LECTURA DEL SECTOR 9 --------------------------------------------
    byte sectorToAccess = 8;  // Modifica esto según el sector que desees acceder
    byte sectorAutenticacion = 35;
    
    sectorToAccess = 9;  // Modifica esto según el sector que desees acceder
    sectorAutenticacion = 39;

    // Autenticar en el sector
    if (mfrc522.PCD_Authenticate(MFRC522::PICC_CMD_MF_AUTH_KEY_A, sectorAutenticacion, &key, &(mfrc522.uid)) == MFRC522::STATUS_OK) {


      byte blockToRead = (sectorToAccess * 4)+1;  // // CONJUNTO DE BLOQUES DONDE ESTA EL ID DEL USUARIO
      byte bufferSize = sizeof(bufferEntrada);
      MFRC522::StatusCode status = mfrc522.MIFARE_Read(blockToRead, bufferEntrada, &bufferSize); //SE LEE UNICAMENTE LOS BLOQUES DONDE ESTA EL IDUSUARIO
      if (status == MFRC522::STATUS_OK) {                                                        //YA QUE EL TAMANO DEL JSON ES INVARIANTE (SUS KEYS Y CAMPOS)
        for (byte i = 0; i < 16; i++) {
          Serial.print(bufferEntrada[i], HEX);
        }
        Serial.println();
      } else {
        Serial.println("Error al leer el bloque");
        Serial.println(mfrc522.GetStatusCodeName(status));
      }
    } else {
      Serial.println("Error al autentic el sect");
    }

    // Halt PICC
    mfrc522.PICC_HaltA();

    // Stop encryption on PCD
    mfrc522.PCD_StopCrypto1();
  }
  

  mfrc522.PICC_HaltA();
  delay(2000);
}
