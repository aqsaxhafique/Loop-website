import React from "react";
import "./about.css";
import { Helmet } from "react-helmet";

function About() {
  return (
    <main className="about-page middle-content">
      <Helmet>
        <title>About Loop, Handcrafted Pancakes & Treats</title>
        <meta
          name="description"
          content="Learn about Loop, a small-batch bakery specializing in handcrafted pancakes, waffles and savory treats made with premium ingredients."
        />
        <meta name="keywords" content="about Loop, bakery, handcrafted pancakes, small-batch bakery, pancakes, waffles" />
        <link rel="canonical" href={window.location.origin + "/about"} />
        <meta property="og:title" content="About Loop, Handcrafted Pancakes & Treats" />
        <meta property="og:description" content="Loop is a small-batch bakery crafting fresh pancakes and treats daily. Learn about our mission and values." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={window.location.href} />
        <meta name="twitter:card" content="summary" />
      </Helmet>
      <section className="about-container">
        <h2 className="about-heading">About Loop</h2>
        <p className="about-lead">
          Loop is a small-batch bakery and café dedicated to crafting simple,
          honest food that makes mornings and moments better. We specialize in
          mini pancakes, waffles and a rotating selection of savory items made
          from thoughtfully-sourced ingredients.
        </p>

        <h3>Our Philosophy</h3>
        <p>
          We believe great food starts with real ingredients and care. Our menu
          focuses on flavor, texture and freshness — we prepare items in small
          batches so every order tastes like it was made just for you. We aim
          to be sustainable where possible by minimizing waste and choosing
          local suppliers.
        </p>

        <h3>How We Work</h3>
        <p>
          Orders can be placed online for pickup or delivery. We welcome
          custom requests for events — reach out via the contact page or
          through our phone/email listed in the footer. For special orders,
          please place your order at least one day in advance to ensure
          availability.
        </p>

        <h3>Our Promise</h3>
        <p>
          Friendly service, consistent quality, and treats that put a smile on
          your face — that’s the Loop promise. If something isn’t right,
          contact us and we’ll make it right.
        </p>
      </section>
    </main>
  );
}

export { About };
