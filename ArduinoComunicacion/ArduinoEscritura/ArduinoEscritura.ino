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
  
  if (Serial.available() > 0 && mensajePendiente == false) { //Verifico si al arduino le llego algun mensaje (unico posible = JSON con IDVisitante)


    char jsonBuffer[TAMANO_BUFFER];
    int bytesRead = Serial.readBytesUntil('\n', jsonBuffer, TAMANO_BUFFER);
    jsonBuffer[bytesRead] = '\0';


    StaticJsonDocument<TAMANO_BUFFER> doc; //Variable que representa un documento JSON
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
  
  if ( mfrc522.PICC_IsNewCardPresent() && mfrc522.PICC_ReadCardSerial() && mensajePendiente == true) { //Si se acerco la tarjeta y hay mensaje pendiente, lo grabo
    
    mensajePendiente = false;
    MFRC522::MIFARE_Key key;
    for (byte i = 0; i < 6; i++) {
      key.keyByte[i] = 0xFF;
    }

    //Escritura del bloque 8 (autenticacion y posterior escritura)
    byte sector         = 8; 
    byte blockAddr      = 32; 
    byte bloqueAutenticacion   = 35;

    MFRC522::StatusCode status;
    status = (MFRC522::StatusCode) mfrc522.PCD_Authenticate(MFRC522::PICC_CMD_MF_AUTH_KEY_A, bloqueAutenticacion, &key, &(mfrc522.uid)); //AUTENTICACION DEL SECTOR
    if (status != MFRC522::STATUS_OK) {
        Serial.print(F("PCD_Authenticate() failed: "));
        Serial.println(mfrc522.GetStatusCodeName(status));
        return;
    }
    
    int x = 0;

    String lecturaParcial = "";

    for (blockAddr = 32; blockAddr<35; blockAddr++){    
      lecturaParcial = "";
      for (int i = 0; i < 16; i++) {
        buffer[i] = jsonString.charAt(x);  //SE PASA EL JSON A BUFFER Y LUEGO ESTE SE CARGA EN LOS BLOQUES INDICADOS
        lecturaParcial += jsonString.charAt(x);
        x++;
      }
      
      status = (MFRC522::StatusCode) mfrc522.MIFARE_Write(blockAddr, buffer, 16);  //ESCRITURA DEL SECTOR (ESCRITURA DEL BUFFER EN TARJETA)
      
      if (status != MFRC522::STATUS_OK) {
          Serial.print(F("MIFARE_Write() failed: "));
          Serial.println(mfrc522.GetStatusCodeName(status));
      }
    }

    //Escritura del bloque 9 (autenticacion y posterior escritura)

    sector = 9;
    bloqueAutenticacion = 39;

    status = (MFRC522::StatusCode) mfrc522.PCD_Authenticate(MFRC522::PICC_CMD_MF_AUTH_KEY_A, bloqueAutenticacion, &key, &(mfrc522.uid));
    if (status != MFRC522::STATUS_OK) {
      Serial.print(F("PCD_Authenticate() failed: "));
      Serial.println(mfrc522.GetStatusCodeName(status));
      return;
    }
    
    for (blockAddr = 36; blockAddr<39; blockAddr++){ 
      lecturaParcial = "";
      for (int i = 0; i < 16; i++) {
        buffer[i] = jsonString.charAt(x);
        lecturaParcial += jsonString.charAt(x);
        x++;
      }
      
      status = (MFRC522::StatusCode) mfrc522.MIFARE_Write(blockAddr, buffer, 16);
      
      if (status != MFRC522::STATUS_OK) {
          Serial.print(F("MIFARE_Write() failed: "));
          Serial.println(mfrc522.GetStatusCodeName(status));
      }
    }
    Serial.println(F("Escritura exitosa")); //SI SE ESCRIBIERON LOS 2 SECTORES, SE ENVIA MENSAJE DE EXITO AL JS

  }
  

  mfrc522.PICC_HaltA();
  delay(3000);
}
