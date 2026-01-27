# SAAS-TENANT-APP-MOBIL

## Instrucciones para iniciar el proyecto móvil

1. Entra a la carpeta del proyecto móvil:
	```bash
	cd app-movil
	```

2. Instala las dependencias:
	```bash
	npm install
	```

3. Inicia el servidor de desarrollo de Expo:
	```bash
	npm start
	# o también puedes usar
	npx expo start
	```

4. Escanea el código QR con la app Expo Go en tu dispositivo, o usa un emulador Android/iOS.

### Comandos útiles

- `npm run android` — Inicia la app directamente en un emulador/dispositivo Android.
- `npm run ios` — Inicia la app en un simulador iOS (solo Mac).
- `npm run web` — Ejecuta la app en el navegador web.
- `npm run lint` — Ejecuta el linter para revisar el código.

### Notas
- Asegúrate de tener Node.js y Expo CLI instalados globalmente (`npm install -g expo-cli`).
- Si tienes problemas, reinicia Metro bundler y borra caché con `npx expo start -c`.
- El archivo `app-movil/README.md` contiene más detalles y recursos sobre Expo.