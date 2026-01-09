/* eslint-disable no-unused-vars */
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import "./LandingPage.css";

// Pune tu imaginile aici (în assets) și schimbă numele după cum vrei:
import heroImg from "../assets/hero-ana.jpg";
import featureMap from "../assets/feature-map1.jpg";
import featureReport from "../assets/feature-report.jpg";
//import featureAdmin from "../assets/feature-admin.jpg";
//const heroImg = "/images/hero.jpg";
//const featureMap = "/images/feature-map.jpg";
//const featureReport = "/images/feature-report.jpg";
const featureAdmin = "/images/feature-admin.jpg";


const fadeUp = {
  hidden: { opacity: 0, y: 18 },
  show: (i = 0) => ({ opacity: 1, y: 0, transition: { delay: 0.08 * i, duration: 0.55, ease: "easeOut" } })
};

export default function LandingPage() {
  return (
    <motion.div className="lp">
      {/* HERO */}
      <section className="hero">
        <motion.div className="heroGlow" />
        <motion.div className="heroInner">
          <motion.div initial="hidden" animate="show" variants={fadeUp} className="heroLeft">
            <motion.div variants={fadeUp} custom={0} className="kicker">
              🎣 FishTrack — pescuit modern, digitalizat
            </motion.div>

            <motion.h1 variants={fadeUp} custom={1}>
              Găsește bălți, filtrează inteligent, raportează capturi și gestionează totul dintr-un singur loc.
            </motion.h1>

            <motion.p variants={fadeUp} custom={2}>
              Platformă pentru pescari și administratori: hartă interactivă, filtrare după locație/preț/rating,
              rapoarte moderate și gestionarea completă a bălților.
            </motion.p>

            <motion.div variants={fadeUp} custom={3} className="ctaRow">
              <Link className="btn primary" to="/map">Explorează harta</Link>
              <Link className="btn ghost" to="/register">Creează cont</Link>
            </motion.div>

            <motion.div variants={fadeUp} custom={4} className="chips">
              <div className="chip">Leaflet / Maps</div>
              <div className="chip">Filtre avansate</div>
              <div className="chip">Rapoarte & Moderare</div>
              <div className="chip">Admin bălți</div>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.98, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="heroRight"
          >
            <div className="imgFrame">
              <img src={heroImg} alt="FishTrack hero" />
            </div>

            <div className="floatingCard">
              <div className="fcTitle">Ce poți face rapid</div>
              <ul>
                <li>🔎 Căutare & filtre (județ, preț, rating)</li>
                <li>🗺️ Hartă interactivă cu marker-e</li>
                <li>📝 Trimite rapoarte de pescuit (pending → approved)</li>
                <li>🛠️ Admin: actualizează bălți, verifică rapoarte</li>
              </ul>
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* FEATURES */}
      <section className="section">
        <motion.div initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.2 }} className="grid3">
          <motion.div variants={fadeUp} custom={0} className="card">
            <div className="cardTitle">Hartă interactivă</div>
            <div className="cardText">
              Explorezi bălțile pe hartă, vezi detalii, preț, rating și reguli.
            </div>
            <div className="thumb"><img src={featureMap} alt="Feature map" /></div>
          </motion.div>

          <motion.div variants={fadeUp} custom={1} className="card">
            <div className="cardTitle">Rapoarte de pescuit</div>
            <div className="cardText">
              Pescarii adaugă rapoarte, iar admin-ul le poate modera pentru transparență și calitate.
            </div>
            <div className="thumb"><img src={featureReport} alt="Feature reports" /></div>
          </motion.div>

          <motion.div variants={fadeUp} custom={2} className="card">
            <div className="cardTitle">Administrare bălți</div>
            <div className="cardText">
              Administratorii actualizează informații despre bălți, reguli, prețuri și feedback vizual.
            </div>
            <div className="thumb"><img src={featureAdmin} alt="Feature admin" /></div>
          </motion.div>
        </motion.div>
      </section>

      {/* HOW IT WORKS (flow) */}
      <section className="section">
        <div className="sectionHead">
          <h2>Cum funcționează</h2>
          <p>Flux simplu, gândit pentru pescari și administratori.</p>
        </div>

        <div className="timeline">
          {[
            { t: "1) Autentificare / Înregistrare", d: "Pescar sau Administrator (cu date suplimentare)." },
            { t: "2) Explorează harta", d: "Cauți bălți, filtrezi după județ, preț, rating." },
            { t: "3) Detalii + Feedback", d: "Vezi reguli, cost, rating și descriere." },
            { t: "4) Rapoarte", d: "Pescarii trimit rapoarte → admin le aprobă." },
          ].map((s, i) => (
            <motion.div
              key={s.t}
              className="step"
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ delay: i * 0.05, duration: 0.5 }}
            >
              <div className="stepDot" />
              <div>
                <div className="stepTitle">{s.t}</div>
                <div className="stepText">{s.d}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="section cta">
        <div className="ctaBox">
          <div>
            <h2>Începe acum</h2>
            <p>Intră pe hartă sau creează cont ca să folosești rapoarte și administrare.</p>
          </div>
          <div className="ctaRow">
            <Link className="btn primary" to="/map">Hartă</Link>
            <Link className="btn ghost" to="/login">Login</Link>
          </div>
        </div>
      </section>

      <footer className="footer">
        <div>© {new Date().getFullYear()} FishTrack — Pescuit modern, digitalizat.</div>
      </footer>
    </motion.div>
  );
}
