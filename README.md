<p align="center">
  <a href="https://www.identi.digital/">
    <img src="./src/assets/imgs/logo_identi.png" alt="Descripción de la imagen" width="300">
  </a>
</p>

<p align="center">
  Cartera Identi es un ejercicio técnico y de prueba <code>(Proof of Concept)</code> centrado en la integración de Identificadores Descentralizados (DID) en un caso de uso hipotético de solicitudes de crédito. El objetivo principal es explorar y documentar cómo la tecnología DID, junto con el ecosistema de IDENTI, puede mejorar la seguridad y la gestión de la identidad en procesos que tradicionalmente dependen de credenciales centralizadas.
</p>

## Funcionalidades Principales

<p >Las funcionalidades de la aplicación simulan un flujo de trabajo típico de gestión de identidad y crédito, utilizando DID.</p>

- **Credencial de Identidad**: La primera vez que el usuario accede a la app, se crea una credencial de identidad digital. Esta credencial, que no está vinculada a una entidad central, es el pilar de la identidad del usuario y es necesaria para acceder a los demás servicios de la cartera.

- **Solicitud de Crédito**: Se simula una solicitud de crédito a un "banco" hipotético. La aplicación no solo envía los datos necesarios, sino que también gestiona las credenciales verificables asociadas, demostrando cómo se podría verificar la identidad del usuario de forma segura.

- **Visualizar Solicitud**: El usuario puede revisar el estado de sus solicitudes simuladas, lo que permite observar cómo se gestionaría la comunicación asincrónica de verificaciones o aprobaciones en un sistema real basado en DID.

- **Visualizar Credenciales**: La aplicación actúa como una "cartera" de credenciales, permitiendo al usuario ver todas las credenciales que ha emitido y recibido.

## Requerimientos

- Java Development Kit (JDK) versión 17+
- Node.js versión 20+
- React Native CLI
- Archivo .env (solicítalo)

#### Compatibilidad

**Cartera Identi** está diseñada para funcionar en dispositivos Android con API level 29 y superiores.

## Instalación

1. Asegúrate de tener React Native instalado en tu sistema. Si aún no lo tienes, sigue las instrucciones en [Instalación de React Native](https://reactnative.dev/docs/environment-setup).

2. Clonar este repositorio:

```
git clone git@github.com:identi-digital/cartera_identi_open_source.git
```

3. Instalación de los paquetes de npm:

```
npm install --legacy-peer-deps
```

4. Iniciación del proyecto

```
npm start -- --reset-cache
```

## ⚠️ Posibles Problemas

Esta aplicación integra librerías criptográficas avanzadas y funcionalidades de Node.js, lo que puede generar algunos desafíos de compatibilidad durante la instalación. Los errores suelen depender del entorno de trabajo y la versión de Node.js que estés utilizando.

Para solucionar estos problemas, te recomendamos lo siguiente:

- Revisa la documentación de las librerías específicas que están causando el conflicto.
- Consulta la documentación oficial de Node.js para obtener información sobre compatibilidad.
- Si el problema persiste, no dudes en crear una incidencia en este repositorio para que podamos resolverlo juntos con la ayuda de la comunidad.

## Contribución

Estamos encantados de recibir contribuciones de la comunidad para mejorar **Billetera Identi**. Si estás interesado en contribuir, aquí te mostramos algunas maneras en las que puedes hacerlo:

- **Sugerir una característica**: Si tienes una idea para una nueva funcionalidad que podría mejorar la aplicación, abre un issue en el repositorio para discutir tu sugerencia. Nos encantaría escuchar tus ideas y colaborar en su implementación.

      Para contribuir, sigue estos pasos:

      1. Haz un "fork" de este repositorio.
      2. Crea una nueva rama para tu función o corrección (`git checkout -b feature/nueva-funcion`).
      3. Realiza tus cambios y realiza commits descriptivos (`git commit -m 'Agrega nueva función'`).
      4. Envía tus cambios al repositorio forkeado (`git push origin feature/nueva-funcion`).
      5. Abre un Pull Request en este repositorio desde tu rama forkeada.

      Revisaremos tu contribución lo antes posible
      ¡Esperamos tus sugerencias y mejoras!

- **Implementación de correcciones de errores y mejoras**: Si deseas corregir un error o implementar una mejora, primero revisa los issues abiertos para ver si alguien más ya está trabajando en ello. Si no es así, crea un issue para anunciar tu intención de trabajar en la corrección o mejora y luego envía un pull request cuando hayas terminado, para contribuir a la mejora del proyecto sigue los pasos del punto anterior.

- **Informar errores**: Si encuentras un error o problema en la aplicación, por favor, repórtalo a través del [sistema de issues](https://github.com/Identi-OpenSource/micacao-wallet/issues). Asegúrate de proporcionar detalles sobre el problema, cómo reproducirlo y cualquier información adicional que pueda ser útil para corregirlo.

- **Respondiendo a los problemas**: Ayuda a la comunidad respondiendo a los problemas abiertos en el repositorio. Si tienes experiencia en la solución de problemas específicos, tus sugerencias y soluciones serán muy apreciadas.

¡Gracias por tu interés en contribuir a **Billetera Identi**! Tu ayuda es invaluable para mejorar la herramienta y apoyar a los productores de cacao en Colombia y Perú.

## Licencia

Este proyecto está licenciado bajo la Licencia Apache-2.0. Consulta el archivo [LICENSE](./LICENSE) para obtener detalles completos.

## Aviso de Licencia MIT

El software está proporcionado "tal cual", sin ninguna garantía de ningún tipo. Los autores no son responsables de ningún daño que pueda surgir del uso del software.
