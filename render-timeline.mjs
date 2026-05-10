import { bundle } from "@remotion/bundler";
import { renderMedia, selectComposition } from "@remotion/renderer";
import { enableScss } from "@remotion/enable-scss";
import { enableTailwind } from "@remotion/tailwind";
import { createRequire } from "node:module";
import { fileURLToPath } from "url";
import webpack from "webpack";
import path from "path";
import fs from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const require = createRequire(import.meta.url);


if (!process.argv[2])
    throw new Error(
        "No props provided. Use --props {JSON string} to provide props.",
    );
if (process.argv[2] !== "--props")
    throw new Error(
        "Invalid argument. Use --props {JSON string} to provide props.",
    );

const jsonPath = process.argv[3];

if (!jsonPath)
    throw new Error(
        "No JSON path provided. Use --props {JSON file path} to provide props.",
    );



const propsJSON = fs.readFileSync(jsonPath, "utf-8");

const props = JSON.parse(propsJSON);

if (!props.width) throw new Error("No width provided.");
if (!props.height) throw new Error("No height provided.");
if (!props.fps) throw new Error("No fps provided.");
if (!props.fileName) throw new Error("No fileName provided.");
if (props.timeline === undefined) throw new Error("No timeline provided.");
if (props.config === undefined) throw new Error("No config provided.");

const fonts = []

Object.values(props.timeline.trackItemDetailsMap).forEach(item => {
    if (!item.details?.fontFamily || !item.details?.fontUrl) return
    fonts.push({name: item.details.fontFamily, url: item.details.fontUrl})
})


const bundled = await bundle({
    entryPoint: require.resolve("./src/remotion/timeline.ts"),
    // For debug
    // outDir: path.resolve(__dirname, "dist"),
    // If you have a webpack override in remotion.config.ts, pass it here as well.
    webpackOverride: (config) => {
        config.resolve.alias = {
            ...config.resolve.alias,
            "@": path.resolve(__dirname, "src"), // Добавляем alias для '@'
        };

        config = enableScss(config);

        config = enableTailwind(config);

        config.module.rules.push({
            test: /\.(woff|woff2|eot|ttf|otf)$/i,
            type: 'asset/resource',
            generator: {
                filename: 'fonts/[name][ext]'
            }
        });

        // Добавляем плагин для определения шрифтов
        config.plugins.push(
            new webpack.DefinePlugin({
                'process.env.FONTS': JSON.stringify(fonts)
            })
        );

        config.plugins = [
            ...(config.plugins || []),
            new webpack.ProvidePlugin({
                React: "react", // Автоматически подключаем React
            }),
        ];

        return config;
    },
});


const { timeline, ...compositionProps } = props;

const { id, ...timelineProps } = timeline;


const inputProps = {
    // fileName: "Superduper",
    // fps: 30,
    // width: 1024,
    // height: 512,
    // timeline: { ... },
    // config: { ... } (IProjectVideoConfig)
    ...compositionProps,
    ...timelineProps,
};

const composition = await selectComposition({
    serveUrl: bundled,
    id: "Timeline",
    inputProps,
});

console.info("Starting to render composition");


await renderMedia({
    codec: "h264",
    composition,
    serveUrl: bundled,
    outputLocation: `/tmp/${props.fileName}.mp4`,
    chromiumOptions: {
        enableMultiProcessOnLinux: true,
        viewport: {
            width: props.width,
            height: props.height,
        },
    },
    inputProps,
    timeoutInMilliseconds: 1000 * 60 * 1,
    onProgress: ({ progress }) => {
        console.info(`Progress: ${progress}`);
    },
});

console.info(`Rendered composition ${composition.id}.`);
