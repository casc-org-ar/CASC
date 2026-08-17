import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import styles from "./terms.module.css";

export const metadata: Metadata = {
  title: "Términos y Condiciones – Shopping Fest 2026",
  description:
    "Condiciones de uso, participación y política de privacidad del evento Shopping Fest 2026.",
};

const MAIL = "casc@casc.org.ar";

export default function TermsPage() {
  return (
    <main className={styles.wrap}>
      <div className={styles.container}>
        <header className={styles.header}>
          <div className={styles.logo}>
            <Image
              src="/images/logotipo.png"
              alt="Shopping Fest"
              width={512}
              height={512}
              className={styles.logoMain}
            />
          </div>

          <div className={styles.titlebox}>
            <div className={styles.kicker}>Información legal</div>
            <h1 className={styles.mainTitle}>Términos y Condiciones</h1>
            <p className={styles.subtitle}>
              Condiciones de uso, participación y política de privacidad del
              evento Shopping Fest 2026.
            </p>
          </div>

          <div className={styles.logo}>
            <Image
              src="/images/casc-black.png"
              alt="CASC"
              width={832}
              height={372}
            />
          </div>
        </header>

        {/* ── Parte A ─────────────────────────────────────────────────── */}
        <section className={styles.card}>
          <div className={styles.cardInner}>
            <span className={styles.sectionLabel}>Parte A</span>
            <h2 className={styles.partTitle}>
              Términos y Condiciones de Uso y Participación en el Shopping Fest
              2026
            </h2>

            <p className={styles.intro}>
              Bienvenido al sitio oficial del evento Shopping Fest 2026. El sitio
              web{" "}
              <span className={styles.strong}>www.shoppingfest.com.ar</span>, sus
              páginas en redes sociales (Instagram, Facebook, TikTok y demás
              plataformas) y todos los demás canales de comunicación oficial del
              evento (en adelante, conjuntamente, los “Canales Oficiales”) son
              operados por la{" "}
              <span className={styles.strong}>
                Cámara Argentina de Shopping Centers
              </span>
              , CUIT 30-64450793-5, con domicilio en San Martin 910, Ciudad
              Autónoma de Buenos Aires, (en adelante, “la CASC”). Al acceder a
              los Canales Oficiales o participar de cualquier actividad del
              evento, el usuario acepta plena e incondicionalmente los presentes
              Términos y Condiciones.
            </p>

            <div className={styles.block}>
              <h3>1. Naturaleza del evento y rol de la CASC</h3>
              <p>
                Shopping Fest 2026 es un evento comercial nacional organizado y
                promovido por la CASC que reúne a sus centros comerciales
                asociados —shoppings, galerías y centros comerciales de todo el
                país— y a sus respectivos locatarios y marcas, durante los días
                8, 9 y 10 de mayo de 2026.
              </p>
              <p>
                La CASC actúa exclusivamente como organizadora del marco general
                del evento y como facilitadora de la comunicación entre los
                centros comerciales participantes y el público consumidor. En ese
                carácter, la CASC organiza la campaña de comunicación nacional,
                provee materiales de identidad visual del evento y gestiona
                alianzas con bancos y medios de pago. La CASC{" "}
                <span className={styles.strong}>NO</span> ofrece, vende,
                distribuye ni presta productos, servicios, descuentos ni
                promociones en forma directa al consumidor.
              </p>
            </div>

            <div className={styles.block}>
              <h3>
                2. Responsabilidad exclusiva de los centros comerciales, marcas y
                locatarios participantes
              </h3>
              <p>
                Las ofertas, descuentos, promociones, actividades y experiencias
                publicitadas en el marco del Shopping Fest 2026 son ofrecidas en
                forma exclusiva y directa por cada centro comercial, marca o
                locatario participante (en adelante, las “Empresas
                Participantes”), bajo sus propios términos, condiciones y
                políticas de privacidad.
              </p>
              <p>El usuario reconoce y acepta expresamente que:</p>
              <ul className={styles.list}>
                <li>
                  La CASC no controla, no monitorea, no valida ni aprueba las
                  ofertas, descuentos, promociones, actividades y experiencias de
                  las Empresas Participantes, ni su contenido, veracidad,
                  exactitud, vigencia ni cumplimiento.
                </li>
                <li>
                  Cada Empresa Participante es la exclusiva responsable frente al
                  consumidor por: la existencia, calidad, cantidad, estado,
                  seguridad e integridad de los bienes y servicios ofrecidos; la
                  veracidad y exactitud de las ofertas y promociones
                  comprometidas; el cumplimiento de sus propios términos y
                  condiciones; y la atención al cliente, la gestión de reclamos y
                  las devoluciones.
                </li>
                <li>
                  Ni la CASC ni los Canales Oficiales del evento controlan ni son
                  responsables por las actividades, sorteos, concursos ni
                  comunicaciones que las Empresas Participantes realicen en sus
                  propios locales, sitios web o cuentas en redes sociales durante
                  el evento.
                </li>
                <li>
                  En caso de disconformidad con una oferta, promoción, producto o
                  servicio, o ante cualquier incidente ocurrido en el predio de
                  un centro comercial participante, el usuario debe dirigir su
                  reclamo directamente a la Empresa Participante que ofreció la
                  oferta o que explota el predio, y no a la CASC.
                </li>
                <li>
                  Las transacciones que el usuario realice con las Empresas
                  Participantes durante el evento son operaciones entre el usuario
                  y dichas empresas, ajenas a la CASC, realizadas bajo el
                  exclusivo riesgo del usuario respecto de la contraparte.
                </li>
              </ul>
            </div>

            <div className={styles.block}>
              <h3>3. Limitación de responsabilidad de la CASC</h3>
              <p>En ningún caso la CASC será responsable por:</p>
              <ul className={styles.list}>
                <li>
                  La calidad, cantidad, estado, seguridad, integridad o
                  condiciones de los bienes y servicios ofrecidos por las
                  Empresas Participantes.
                </li>
                <li>
                  El incumplimiento de las ofertas, descuentos o promociones
                  comprometidas por las Empresas Participantes.
                </li>
                <li>
                  Daños físicos, corporales, materiales o morales sufridos por el
                  usuario en el predio de cualquier centro comercial participante
                  durante el evento.
                </li>
                <li>
                  La capacidad para contratar de las partes intervinientes en cada
                  transacción entre el usuario y las Empresas Participantes.
                </li>
                <li>
                  Daños indirectos, lucro cesante o cualquier otro perjuicio
                  derivado de transacciones realizadas con las Empresas
                  Participantes.
                </li>
                <li>
                  La veracidad, exactitud o vigencia de la información provista
                  por las Empresas Participantes a través de sus propios canales
                  de comunicación.
                </li>
                <li>
                  Accidentes, incidentes de seguridad, aglomeraciones o cualquier
                  hecho ocurrido en el interior de los predios de los centros
                  comerciales participantes, cuya organización y explotación es
                  responsabilidad exclusiva de cada centro comercial.
                </li>
              </ul>
            </div>

            <div className={styles.block}>
              <h3>4. Modificación del evento por fuerza mayor</h3>
              <p>
                La CASC podrá modificar, suspender o cancelar el evento, o
                modificar las fechas programadas (8, 9 y 10 de mayo de 2026), por
                causas de fuerza mayor o caso fortuito, incluyendo sin
                limitación: (i) pandemias, epidemias u otros riesgos sanitarios o
                epidemiológicos; (ii) desastres naturales; (iii) decisiones del
                Gobierno Nacional, Provincial o Municipal que impidan o restrinjan
                la realización del evento; (iv) situaciones de crisis o
                desequilibrio social o económico que impacten en los consumidores
                y/o en las Empresas Participantes; (v) paros generales o masivos,
                movilizaciones o manifestaciones que impidan el normal desarrollo
                del evento; y (vi) imposibilidad de obtención de los permisos o
                habilitaciones necesarios para la realización del evento en una o
                más jurisdicciones del país. En ninguno de estos casos la CASC
                tendrá responsabilidad indemnizatoria frente al usuario.
              </p>
            </div>

            <div className={styles.block}>
              <h3>5. Alianzas con bancos y medios de pago</h3>
              <p>
                La CASC podrá gestionar y comunicar alianzas con bancos y medios
                de pago que ofrezcan beneficios especiales a los usuarios durante
                el evento. El usuario reconoce y acepta que: (a) los beneficios
                son ofrecidos directamente por cada banco o medio de pago bajo sus
                propios términos y condiciones; (b) la disponibilidad, vigencia y
                condiciones de cada beneficio son determinadas por el banco o
                medio de pago correspondiente; y (c) la CASC no es responsable por
                la modificación, suspensión o incumplimiento de los beneficios
                ofrecidos por los bancos y medios de pago.
              </p>
            </div>

            <div className={styles.block}>
              <h3>6. Propiedad intelectual</h3>
              <p>
                Shopping Fest, el logo del evento y todos los contenidos
                originales de los Canales Oficiales —textos, imágenes, diseños,
                videos y demás elementos— son propiedad de la CASC. Queda
                prohibida su reproducción total o parcial, su distribución,
                modificación o uso con fines comerciales sin autorización expresa
                y escrita de la CASC, salvo para los fines específicamente
                previstos en el marco del evento. Toda infracción podrá ser
                perseguida conforme la Ley N° 22.362 de Marcas y Designaciones y
                demás normativa aplicable.
              </p>
            </div>

            <div className={styles.block}>
              <h3>7. Modificación de los Términos y Condiciones</h3>
              <p>
                La CASC podrá modificar los presentes Términos y Condiciones en
                cualquier momento. La versión vigente será siempre la publicada en
                los Canales Oficiales. Las modificaciones entrarán en vigor desde
                el momento de su publicación. Se aconseja al usuario consultar
                periódicamente los Términos y Condiciones.
              </p>
            </div>

            <div className={styles.block}>
              <h3>8. Jurisdicción y ley aplicable</h3>
              <p>
                Los presentes Términos y Condiciones se rigen por el derecho de la
                República Argentina, con exclusión de toda norma que remita a la
                aplicación de una ley extranjera. Cualquier controversia entre la
                CASC y el usuario será sometida a los Tribunales Ordinarios en lo
                Comercial de la Ciudad Autónoma de Buenos Aires, con renuncia a
                cualquier otro fuero o jurisdicción que pudiera corresponder.
              </p>
            </div>
          </div>
        </section>

        {/* ── Parte B ─────────────────────────────────────────────────── */}
        <section className={styles.card}>
          <div className={styles.cardInner}>
            <span className={styles.sectionLabel}>Parte B</span>
            <h2 className={styles.partTitle}>
              Política de Privacidad del Evento Shopping Fest 2026
            </h2>

            <p className={styles.intro}>
              <span className={styles.strong}>Vigencia:</span> a partir de su
              publicación en los Canales Oficiales del evento.
            </p>

            <p className={styles.intro}>
              La presente Política de Privacidad regula el tratamiento de datos
              personales de los usuarios que la CASC pueda realizar a través de
              los Canales Oficiales del evento Shopping Fest 2026, conforme la Ley
              N° 25.326 de Protección de Datos Personales y la Disposición AAIP
              N° 4/2019. Este documento integra y complementa los Términos y
              Condiciones del evento. Al acceder a los Canales Oficiales, el
              usuario acepta también la presente Política de Privacidad.
            </p>

            <p className={styles.intro}>
              La CASC no desarrolla ni opera una plataforma de registro de
              usuarios propia en el marco del Shopping Fest 2026, y no genera una
              base de datos de consumidores del evento. No obstante, el uso de los
              Canales Oficiales puede implicar el tratamiento de datos técnicos de
              navegación, conforme se detalla a continuación.
            </p>

            <div className={styles.block}>
              <h3>1. Responsable del tratamiento</h3>
              <p>
                Cámara Argentina de Shopping Centers (CASC), CUIT 30-64450793-5,
                con domicilio en San Martin 910, Ciudad Autonoma de Buenos Aires.
                Contacto para consultas de privacidad:{" "}
                <a href={`mailto:${MAIL}`} className={styles.link}>
                  {MAIL}
                </a>
                .
              </p>
            </div>

            <div className={styles.block}>
              <h3>2. Datos que pueden recopilarse</h3>
              <p>
                A través de los Canales Oficiales del evento, la CASC puede
                recopilar los siguientes datos de carácter técnico, sin que ello
                implique la identificación directa del usuario:
              </p>
              <ul className={styles.list}>
                <li>Dirección IP del dispositivo del usuario.</li>
                <li>Tipo de dispositivo, navegador web y sistema operativo.</li>
                <li>
                  Ubicación geográfica aproximada derivada de la dirección IP.
                </li>
                <li>Horarios y duración de acceso a los Canales Oficiales.</li>
                <li>
                  Páginas y secciones visitadas dentro de los Canales Oficiales.
                </li>
              </ul>
              <p>
                En el supuesto de que la CASC habilite en el futuro alguna
                funcionalidad de contacto o registro voluntario (formulario de
                consulta, suscripción a notificaciones, participación en
                concursos), los datos adicionales que en ese marco se recopilen
                serán informados al usuario de forma específica y previa, con
                indicación de las finalidades del tratamiento y el mecanismo para
                otorgar el consentimiento informado exigido por la Ley N° 25.326.
              </p>
            </div>

            <div className={styles.block}>
              <h3>3. Finalidades del tratamiento</h3>
              <p>
                Los datos técnicos de navegación se utilizan exclusivamente para:
                (a) el correcto funcionamiento técnico de los Canales Oficiales;
                (b) el análisis estadístico agregado y anónimo del uso de los
                Canales Oficiales, con fines de mejora del servicio; y (c) el
                cumplimiento de obligaciones legales aplicables.
              </p>
            </div>

            <div className={styles.block}>
              <h3>4. Cookies y tecnologías similares</h3>
              <p>
                Los Canales Oficiales pueden utilizar cookies y tecnologías
                similares para mejorar la experiencia del usuario y obtener
                información estadística de navegación. Las cookies no recolectan
                información personal identificable de manera directa. El usuario
                puede configurar su navegador para rechazar las cookies o para
                recibir una notificación antes de que sean instaladas, aunque ello
                puede afectar el funcionamiento de algunas funcionalidades del
                sitio. La única información personal que una cookie puede contener
                es la que el propio usuario provee voluntariamente en su
                navegación.
              </p>
            </div>

            <div className={styles.block}>
              <h3>5. Cesión de datos a terceros</h3>
              <p>
                La CASC no cederá datos de usuarios a terceros, salvo en los
                siguientes supuestos: (a) cuando sea requerido por orden judicial
                o de autoridad administrativa competente que razonablemente
                consideremos con competencia para solicitarla; y (b) cuando sea
                necesario para el correcto funcionamiento técnico de los Canales
                Oficiales, en cuyo caso los proveedores de servicios tecnológicos
                que intervengan estarán sujetos a las mismas obligaciones de
                confidencialidad y seguridad que la CASC.
              </p>
            </div>

            <div className={styles.block}>
              <h3>6. Seguridad</h3>
              <p>
                La CASC adoptará las medidas técnicas y organizativas razonables
                para proteger los datos de los usuarios frente al acceso no
                autorizado, alteración, divulgación o destrucción. No obstante,
                ningún sistema de transmisión de datos por Internet puede
                garantizar una seguridad absoluta.
              </p>
            </div>

            <div className={styles.block}>
              <h3>7. Derechos del titular de los datos</h3>
              <p>
                El titular de los datos tiene derecho a: (a) acceder en forma
                gratuita a sus datos personales; (b) rectificar datos inexactos o
                incompletos; (c) solicitar la supresión de datos cuando no exista
                causa legal para su conservación; (d) solicitar la
                confidencialidad de sus datos.
              </p>
              <p>
                Estos derechos pueden ejercerse mediante solicitud escrita
                dirigida a{" "}
                <a href={`mailto:${MAIL}`} className={styles.link}>
                  {MAIL}
                </a>
                , con identificación del titular.
              </p>
              <p>
                La AGENCIA DE ACCESO A LA INFORMACIÓN PÚBLICA (AAIP), en su
                carácter de Órgano de Control de la Ley N° 25.326, tiene la
                atribución de atender las denuncias y reclamos que se interpongan
                con relación al incumplimiento de las normas sobre protección de
                datos personales. Sitio web:{" "}
                <a
                  href="https://www.argentina.gob.ar/aaip"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.link}
                >
                  www.argentina.gob.ar/aaip
                </a>
                .
              </p>
            </div>

            <div className={styles.block}>
              <h3>8. Menores de edad</h3>
              <p>
                Los Canales Oficiales del evento están destinados a personas
                mayores de 18 años. Los menores de edad sólo podrán acceder bajo
                supervisión de sus padres, tutores o adultos responsables. La CASC
                no recopila deliberadamente datos personales de menores de edad.
                Si un padre o tutor tomara conocimiento de que su hijo menor ha
                provisto datos personales a través de los Canales Oficiales, puede
                solicitar su supresión a través del correo electrónico indicado en
                la cláusula 7.
              </p>
            </div>

            <div className={styles.block}>
              <h3>9. Modificaciones a la Política de Privacidad</h3>
              <p>
                La CASC podrá modificar la presente Política de Privacidad en
                forma periódica para reflejar cambios en los Canales Oficiales, en
                sus prácticas de tratamiento de datos o en la normativa aplicable.
                La versión vigente será siempre la publicada en los Canales
                Oficiales. Las modificaciones entrarán en vigor desde el momento
                de su publicación.
              </p>
            </div>

            <p className={styles.footerNote}>
              Última versión publicada en los Canales Oficiales del evento
              Shopping Fest 2026.
            </p>
          </div>
        </section>

        <p className={styles.footerNote}>
          <Link href="/" className={styles.link}>
            ← Volver al inicio
          </Link>
        </p>
      </div>
    </main>
  );
}
