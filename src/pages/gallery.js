import React from "react"
import { graphql, StaticQuery } from "gatsby"
import Img from "gatsby-image"

import Layout from "../components/layout"
import SEO from "../components/seo"

import "../utils/normalize.css"
import "../utils/css/screen.css"

const AboutPage = ({ data }, location) => {
  const siteTitle = data.site.siteMetadata.title

  return (
    <Layout title={siteTitle}>
      <SEO title="Gallery" keywords={[`blog`, `gatsby`, `javascript`, `react`]} />

      <article className="post-content page-template no-image">
        <div className="post-content-body">
          <h2 id="opening-line">
            Here's the world through my colored glasses
          </h2>

          <p id="about-my-work" align="center">
            I present some of my prized captures here.
          </p>

          <figure className="kg-card kg-image-card kg-width-half">
            <Img
              fluid={data.blue_glare.childImageSharp.fluid}
              className="kg-image"
            />
            <figcaption>Nights at Spiti | 31 March, 2021 : Kaza, In</figcaption>
          </figure>

          <figure className="kg-card kg-image-card kg-width-half">
            <Img
              fluid={data.sundarsar.childImageSharp.fluid}
              className="kg-image"
            />
            <figcaption>Shades of Vacancy | 23 July, 2021 : Kashmir, In</figcaption>
          </figure>

          <figure className="kg-card kg-image-card kg-width-half">
            <Img
              fluid={data.kolahoi.childImageSharp.fluid}
              className="kg-image"
            />
            <figcaption>Kolahoi (5425 m) | 23 July, 2021 : Kashmir, In</figcaption>
          </figure>

          <figure className="kg-card kg-image-card kg-width-half">
            <Img
              fluid={data.sandakphu.childImageSharp.fluid}
              className="kg-image"
            />
            <figcaption>Kanchenjunga (8586 m) | 11 March, 2020 : Sikkim, In</figcaption>
          </figure>

          <figure className="kg-card kg-image-card kg-width-half">
            <Img
              fluid={data.diwali.childImageSharp.fluid}
              className="kg-image"
            />
            <figcaption>Diwali at Home | 14 November, 2020 : Odisha, In</figcaption>
          </figure>

          <figure className="kg-card kg-image-card kg-width-half">
            <Img
              fluid={data.home.childImageSharp.fluid}
              className="kg-image"
            />
            <figcaption>For another day | 27 April, 2020 : Odisha, In</figcaption>
          </figure>

          <figure className="kg-card kg-image-card kg-width-half">
            <Img
              fluid={data.key_gompa.childImageSharp.fluid}
              className="kg-image"
            />
            <figcaption>Key Monastery | 2 April, 2021 : Kaza, 2021</figcaption>
          </figure>

          <figure className="kg-card kg-image-card kg-width-half">
            <Img
              fluid={data.shekwas.childImageSharp.fluid}
              className="kg-image"
            />
            <figcaption>Dramatic shades of Kashmir | 22 July, 2021 : Kashmir, In</figcaption>
          </figure>

          <figure className="kg-card kg-image-card kg-width-half">
            <Img
              fluid={data.dzukou.childImageSharp.fluid}
              className="kg-image"
            />
            <figcaption>Dzukou Valley | 17 October, 2018 : Nagaland, In</figcaption>
          </figure>

          <figure className="kg-card kg-image-card kg-width-half">
            <Img
              fluid={data.hampta.childImageSharp.fluid}
              className="kg-image"
            />
            <figcaption>Hampta Pass | 14 July, 2019 : Himanchal, In</figcaption>
          </figure>

          <figure className="kg-card kg-image-card kg-width-half">
            <Img
              fluid={data.tarsar_pass.childImageSharp.fluid}
              className="kg-image"
            />
            <figcaption>Tarsar Lake | 22 July, 2021 : Kashmir, In</figcaption>
          </figure>

          <figure className="kg-card kg-image-card kg-width-half">
            <Img
              fluid={data.tarsar_pass_2.childImageSharp.fluid}
              className="kg-image"
            />
            <figcaption>Vallies of Kashmir | 22 July, 2021 : Kashmir, In</figcaption>
          </figure>

          <figure className="kg-card kg-image-card kg-width-half">
            <Img
              fluid={data.tabo_coll.childImageSharp.fluid}
              className="kg-image"
            />
            <figcaption>Shades of a 1000 year monastery | 30 March, 2021 : Tabo, In.</figcaption>
          </figure>

        </div>
      </article>
    </Layout >
  )
}

const indexQuery = graphql`
  query {
    site {
      siteMetadata {
        title
      }
    }

    blue_glare: file
    (
      relativePath: { eq: "gallery/blue_glare.png" }
    )
    {
      childImageSharp
      {
        fluid(maxWidth: 1360)
        {
          ...GatsbyImageSharpFluid
        }
      }
    }

    key_gompa: file
    (
      relativePath: { eq: "gallery/key_gompa.jpg" }
    )
    {
      childImageSharp
      {
        fluid(maxWidth: 1360)
        {
          ...GatsbyImageSharpFluid
        }
      }
    }

    shekwas: file
    (
      relativePath: { eq: "gallery/shekwas.jpg" }
    )
    {
      childImageSharp
      {
        fluid(maxWidth: 1360)
        {
          ...GatsbyImageSharpFluid
        }
      }
    }

    hampta: file
    (
      relativePath: { eq: "gallery/hampta.jpg" }
    )
    {
      childImageSharp
      {
        fluid(maxWidth: 1360)
        {
          ...GatsbyImageSharpFluid
        }
      }
    }

    dzukou: file
    (
      relativePath: { eq: "gallery/dzukou.jpg" }
    )
    {
      childImageSharp
      {
        fluid(maxWidth: 1360)
        {
          ...GatsbyImageSharpFluid
        }
      }
    }
    
    tabo_coll: file
    (
      relativePath: { eq: "gallery/tabo_coll.jpg" }
    )
    {
      childImageSharp
      {
        fluid(maxWidth: 1360)
        {
          ...GatsbyImageSharpFluid
        }
      }
    }

    nako_coll: file
    (
      relativePath: { eq: "gallery/nako_coll.jpg" }
    )
    {
      childImageSharp
      {
        fluid(maxWidth: 1360)
        {
          ...GatsbyImageSharpFluid
        }
      }
    }
    
    kalpa: file
    (
      relativePath: { eq: "gallery/kalpa.png" }
    )
    {
      childImageSharp
      {
        fluid(maxWidth: 1360)
        {
          ...GatsbyImageSharpFluid
        }
      }
    }

    kolahoi: file
    (
      relativePath: { eq: "gallery/kolahoi.jpg" }
    )
    {
      childImageSharp
      {
        fluid(maxWidth: 1360)
        {
          ...GatsbyImageSharpFluid
        }
      }
    }

    tarsar_pass: file
    (
      relativePath: { eq: "gallery/tarsar_pass.jpg" }
    )
    {
      childImageSharp
      {
        fluid(maxWidth: 1360)
        {
          ...GatsbyImageSharpFluid
        }
      }
    }

    tarsar_pass_2: file
    (
      relativePath: { eq: "gallery/tarsar_pass_2.jpg" }
    )
    {
      childImageSharp
      {
        fluid(maxWidth: 1360)
        {
          ...GatsbyImageSharpFluid
        }
      }
    }

    everest: file
    (
      relativePath: { eq: "gallery/everest.jpg" }
    )
    {
      childImageSharp
      {
        fluid(maxWidth: 1360)
        {
          ...GatsbyImageSharpFluid
        }
      }
    }

    dzukou: file
    (
      relativePath: { eq: "gallery/dzukou.jpg" }
    )
    {
      childImageSharp
      {
        fluid(maxWidth: 1360)
        {
          ...GatsbyImageSharpFluid
        }
      }
    }

    saltwater_room: file
    (
      relativePath: { eq: "gallery/saltwater_room.jpg" }
    )
    {
      childImageSharp
      {
        fluid(maxWidth: 1360)
        {
          ...GatsbyImageSharpFluid
        }
      }
    }

    dal: file
    (
      relativePath: { eq: "gallery/dal.jpg" }
    )
    {
      childImageSharp
      {
        fluid(maxWidth: 1360)
        {
          ...GatsbyImageSharpFluid
        }
      }
    }

    tarsar: file
    (
      relativePath: { eq: "gallery/tarsar.jpg" }
    )
    {
      childImageSharp
      {
        fluid(maxWidth: 1360)
        {
          ...GatsbyImageSharpFluid
        }
      }
    }

    langza_wide: file
    (
      relativePath: { eq: "gallery/langza_wide.png" }
    )
    {
      childImageSharp
      {
        fluid(maxWidth: 1360)
        {
          ...GatsbyImageSharpFluid
        }
      }
    }

    sundarsar: file
    (
      relativePath: { eq: "gallery/sundarsar.jpg" }
    )
    {
      childImageSharp
      {
        fluid(maxWidth: 1360)
        {
          ...GatsbyImageSharpFluid
        }
      }
    }

    home: file
    (
      relativePath: { eq: "gallery/home.jpg" }
    )
    {
      childImageSharp
      {
        fluid(maxWidth: 1360)
        {
          ...GatsbyImageSharpFluid
        }
      }
    }

    sandakphu: file
    (
      relativePath: { eq: "gallery/sandakphu.jpg" }
    )
    {
      childImageSharp
      {
        fluid(maxWidth: 1360)
        {
          ...GatsbyImageSharpFluid
        }
      }
    }

    diwali: file
    (
      relativePath: { eq: "gallery/diwali.jpg" }
    )
    {
      childImageSharp
      {
        fluid(maxWidth: 1360)
        {
          ...GatsbyImageSharpFluid
        }
      }
    }

    feet: file
    (
      relativePath: { eq: "gallery/feet.jpg" }
    )
    {
      childImageSharp
      {
        fluid(maxWidth: 1360)
        {
          ...GatsbyImageSharpFluid
        }
      }
    }
  }
`

export default props => (
  <StaticQuery
    query={indexQuery}
    render={data => (
      <AboutPage location={props.location} data={data} {...props} />
    )}
  />
)
