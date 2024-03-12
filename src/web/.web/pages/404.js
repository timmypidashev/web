/** @jsxImportSource @emotion/react */


import { Fragment, useContext } from "react"
import { EventLoopContext, StateContexts } from "/utils/context"
import { Event, getBackendURL, isTrue } from "/utils/state"
import { WifiOffIcon as LucideWifiOffIcon } from "lucide-react"
import { keyframes } from "@emotion/react"
import { Box as RadixThemesBox, Dialog as RadixThemesDialog, Flex as RadixThemesFlex, Heading as RadixThemesHeading, Link as RadixThemesLink, Text as RadixThemesText } from "@radix-ui/themes"
import env from "/env.json"
import { motion } from "framer-motion"
import NextLink from "next/link"
import NextHead from "next/head"



export function Fragment_e9a05c105aa9215aeba52aeec8fe2e76 () {
  const state = useContext(StateContexts.state)
  const [addEvents, connectErrors] = useContext(EventLoopContext);


  return (
    <Fragment>
  {isTrue(((!state.is_hydrated) || (connectErrors.length > 0))) ? (
  <Fragment>
  <LucideWifiOffIcon css={{"color": "crimson", "zIndex": 9999, "position": "fixed", "bottom": "30px", "right": "30px", "animation": `${pulse} 1s infinite`}} size={32}>
  {`wifi_off`}
</LucideWifiOffIcon>
</Fragment>
) : (
  <Fragment/>
)}
</Fragment>
  )
}

        import { useIsPresent } from "framer-motion";
        

export function Fragment_14636cc997c0546c0967a25d8e600f96 () {
  const [addEvents, connectErrors] = useContext(EventLoopContext);


  return (
    <Fragment>
  {isTrue(connectErrors.length >= 2) ? (
  <Fragment>
  <RadixThemesDialog.Root css={{"zIndex": 9999}} open={connectErrors.length >= 2}>
  <RadixThemesDialog.Content>
  <RadixThemesDialog.Title>
  {`Connection Error`}
</RadixThemesDialog.Title>
  <RadixThemesText as={`p`} css={{"fontFamily": "ComicCode", "fontSize": 24, "color": "#ebdbb2"}}>
  {`Cannot connect to server: `}
  {(connectErrors.length > 0) ? connectErrors[connectErrors.length - 1].message : ''}
  {`. Check if server is reachable at `}
  {getBackendURL(env.EVENT).href}
</RadixThemesText>
</RadixThemesDialog.Content>
</RadixThemesDialog.Root>
</Fragment>
) : (
  <Fragment/>
)}
</Fragment>
  )
}

const pulse = keyframes`
    0% {
        opacity: 0;
    }
    100% {
        opacity: 1;
    }
`


export default function Component() {

  return (
    <Fragment>
  <Fragment>
  <div css={{"position": "fixed", "width": "100vw", "height": "0"}}>
  <Fragment_e9a05c105aa9215aeba52aeec8fe2e76/>
</div>
  <Fragment_14636cc997c0546c0967a25d8e600f96/>
</Fragment>
  <RadixThemesBox>
  <motion.div animate={{"opacity": 1, "y": 0, "transition": {"duration": 0.5, "ease": "easeInOut"}}} initial={{"opacity": 0, "y": -50}}>
  <RadixThemesBox>
  <RadixThemesBox>
  <RadixThemesFlex css={{"display": "flex", "alignItems": "center", "justifyContent": "center"}} gap={`7`}>
  <RadixThemesFlex>
  <RadixThemesLink css={{"fontFamily": "ComicCode", "fontSize": 24, "color": "#000000", "textDecoration": "none", "&:hover": {"color": "#b8bb26"}}}>
  <RadixThemesText as={`p`} css={{"href": "/about", "fontFamily": "ComicCode", "fontSize": 24, "color": "#ebdbb2"}}>
  {`About`}
</RadixThemesText>
</RadixThemesLink>
</RadixThemesFlex>
  <RadixThemesFlex>
  <RadixThemesLink css={{"fontFamily": "ComicCode", "fontSize": 24, "color": "#000000", "textDecoration": "none", "&:hover": {"color": "#b8bb26"}}}>
  <RadixThemesText as={`p`} css={{"href": "/projects", "fontFamily": "ComicCode", "fontSize": 24, "color": "#ebdbb2"}}>
  {`Projects`}
</RadixThemesText>
</RadixThemesLink>
</RadixThemesFlex>
  <RadixThemesFlex>
  <RadixThemesLink css={{"fontFamily": "ComicCode", "fontSize": 24, "color": "#000000", "textDecoration": "none", "&:hover": {"color": "#b8bb26"}}}>
  <RadixThemesText as={`p`} css={{"href": "/resume", "fontFamily": "ComicCode", "fontSize": 24, "color": "#ebdbb2"}}>
  {`Resume`}
</RadixThemesText>
</RadixThemesLink>
</RadixThemesFlex>
  <RadixThemesFlex>
  <RadixThemesLink css={{"fontFamily": "ComicCode", "fontSize": 24, "color": "#000000", "textDecoration": "none", "&:hover": {"color": "#b8bb26"}}}>
  <RadixThemesText as={`p`} css={{"href": "/blog", "fontFamily": "ComicCode", "fontSize": 24, "color": "#ebdbb2"}}>
  {`Blog`}
</RadixThemesText>
</RadixThemesLink>
</RadixThemesFlex>
  <RadixThemesFlex>
  <RadixThemesLink css={{"fontFamily": "ComicCode", "fontSize": 24, "color": "#000000", "textDecoration": "none", "&:hover": {"color": "#b8bb26"}}}>
  <RadixThemesText as={`p`} css={{"href": "shop", "fontFamily": "ComicCode", "fontSize": 24, "color": "#ebdbb2"}}>
  {`Shop`}
</RadixThemesText>
</RadixThemesLink>
</RadixThemesFlex>
</RadixThemesFlex>
</RadixThemesBox>
  <RadixThemesBox>
  <RadixThemesFlex css={{"height": "100vh", "width": "100%", "display": "flex", "alignItems": "center", "justifyContent": "center"}}>
  <RadixThemesFlex align={`start`} direction={`column`} gap={`2`}>
  <motion.div animate={{"opacity": 1, "y": 0, "transition": {"duration": 0.5, "ease": "easeInOut"}}} initial={{"opacity": 0, "y": -50}} whileHover={{"scale": 1.1}}>
  <RadixThemesHeading css={{"fontFamily": "ComicCode", "fontSize": 32, "color": "#ebdbb2"}} size={`9`}>
  {`Whoops, this page doesn't exist...`}
</RadixThemesHeading>
</motion.div>
</RadixThemesFlex>
</RadixThemesFlex>
</RadixThemesBox>
  <RadixThemesBox css={{"borderTop": "2px solid #ebdbb2;"}}>
  <RadixThemesFlex css={{"height": "15vh", "display": "flex", "alignItems": "center", "justifyContent": "center"}}>
  <RadixThemesFlex align={`center`} direction={`column`} gap={`7`}>
  <RadixThemesHeading css={{"fontFamily": "ComicCode", "fontSize": 32, "color": "#ebdbb2"}} size={`9`}>
  {`Footer`}
</RadixThemesHeading>
</RadixThemesFlex>
</RadixThemesFlex>
</RadixThemesBox>
</RadixThemesBox>
</motion.div>
</RadixThemesBox>
  <NextHead>
  <title>
  {`Page Not Found`}
</title>
  <meta content={`A Reflex app.`} name={`description`}/>
  <meta content={`favicon.ico`} property={`og:image`}/>
</NextHead>
</Fragment>
  )
}
