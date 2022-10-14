import {
    ViewerApp,
    AssetManagerPlugin,
    GBufferPlugin,
    timeout,
    ProgressivePlugin,
    TonemapPlugin,
    SSRPlugin,
    SSAOPlugin,
    DiamondPlugin,
    FrameFadePlugin,
    GLTFAnimationPlugin,
    GroundPlugin,
    BloomPlugin,
    TemporalAAPlugin,
    AnisotropyPlugin,
    GammaCorrectionPlugin,

    addBasePlugins,
    ITexture, TweakpaneUiPlugin, AssetManagerBasicPopupPlugin, CanvasSnipperPlugin,

    IViewerPlugin,

    // Color, // Import THREE.js internals
    // Texture, // Import THREE.js internals
} from "webgi";

import "./styles.css";
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

async function setupViewer(){

    // Initialize the viewer
    const viewer = new ViewerApp({
        canvas: document.getElementById('webgi-canvas') as HTMLCanvasElement,
        useRgbm: false
    })

    // Add some plugins
    const manager = await viewer.addPlugin(AssetManagerPlugin)
    const camera = viewer.scene.activeCamera
    const position = camera.position
    const target = camera.target

    // Add plugins individually.
    await viewer.addPlugin(GBufferPlugin)
    await viewer.addPlugin(new ProgressivePlugin(32))
    await viewer.addPlugin(new TonemapPlugin(!viewer.useRgbm))
    // await viewer.addPlugin(GammaCorrectionPlugin)
    await viewer.addPlugin(SSRPlugin)
    await viewer.addPlugin(SSAOPlugin)
    // await viewer.addPlugin(DiamondPlugin)
    // await viewer.addPlugin(FrameFadePlugin)
    // await viewer.addPlugin(GLTFAnimationPlugin)
    // await viewer.addPlugin(GroundPlugin)
    await viewer.addPlugin(BloomPlugin)
    // await viewer.addPlugin(TemporalAAPlugin)
    // await viewer.addPlugin(AnisotropyPlugin)
    
    // or use this to add all main ones at once.
    await addBasePlugins(viewer)

    // Add more plugins not available in base, like CanvasSnipperPlugin which has helpers to download an image of the canvas.
    await viewer.addPlugin(CanvasSnipperPlugin)
    

    viewer.renderer.refreshPipeline()

    await manager.addFromPath("./assets/vintage-watch.glb")


    // Add some UI for tweak and testing.
    const uiPlugin = await viewer.addPlugin(TweakpaneUiPlugin)
    // Add plugins to the UI to see their settings.
    uiPlugin.setupPlugins<IViewerPlugin>(TonemapPlugin, CanvasSnipperPlugin)
    

    function handleScrollAnimation() {
        const tl = gsap.timeline()

        tl
        .to(position, {
            x: 2.02,
            y: 0.75,
            z: -6.70,
            scrollTrigger: {
                trigger: '.second',
                start: 'top bottom',
                end: 'top top',
                scrub: 2,
                immediateRender: false
        }, onUpdate})

        .to(".section--one--container", { xPercent:'-150' , opacity:0,
            scrollTrigger: {
                trigger: ".second",
                start:"top bottom",
                end: "top 80%", scrub: 1,
                immediateRender: false
        }})
        
        .to(target, {
            x: -1.29,
            y: 0.25,
            z: -0.27,
            scrollTrigger: {
                trigger: '.second',
                start: 'top bottom',
                end: 'top top',
                scrub: 2,
                immediateRender: false
        }})

        // Last position
        .to(position, {
            x: 2.90,
            y: 0.13,
            z: 3.12,
            scrollTrigger: {
                trigger: '.third',
                start: 'top bottom',
                end: 'top top',
                scrub: 2,
                immediateRender: false
            }, onUpdate})
        .to(target, {
            x: -1.39,
            y: 0.10,
            z: -0.14,
            scrollTrigger: {
                trigger: '.third',
                start: 'top bottom',
                end: 'top top',
                scrub: 2,
                immediateRender: false
            },
        })
    }
    handleScrollAnimation()

    // WebGi update
    let needsUdpate = true

    function onUpdate() {
        needsUdpate = true
        viewer.renderer.resetShadows()
    }

    // Check every previous frame if we need to update stuff, so when the camera stops, handleScrollAnimation() stops running
    viewer.addEventListener('preFrame', () => {
        if (needsUdpate) {
            camera.positionUpdated(true)
            camera.targetUpdated(true)
            needsUdpate = false
        }
    })
}



setupViewer()
