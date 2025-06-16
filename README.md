
# svg-weboptimizer

## SUMMARY 
svg-weboptimizer converts Inkscape-generated SVGs (and others) to weboptimized assets in seconds. 
     
No config needed. Just run and forget. 

#### Developers Automating SVG Workflow 

This is a CLI-first tool — easy to integrate into build processes, file managers like Vifm, or automation scripts. 

✅ You’ll Love This If… 

    You want SVGs that play nicely with your site’s color scheme.
    You’re tired of manually removing Inkscape/Sodipodi data.
    You need a simple, fast way to prep SVGs for production.
    You're optimizing icons for frameworks or design systems.
    You work with lots of .svg files and want consistency.
     

❌ Not for You If… 

    You're looking for a GUI tool — this is command-line only.
    You don't care about themeability (fill="currentColor") or size optimization.
    You prefer full control over every line of your SVG (you'll lose some editor-specific metadata).
     
## HOW `SVG-WEBOPTIMIZER` COMPARES TO OTHER TOOLS

| Tool | Handles Inkscape Data? | `fill =  "currentColor"`? | Batch Process? | CLI Tool? | Customizable? |
|------|------------------------|-------------------------------|----------------|------------|----------------|
| **SVGO** | ❌ Partially | ❌ No | ✅ Yes | ✅ Yes | ✅ Yes |
| **SVGOMG** | ❌ Partially | ❌ No | ❌ Manual | ❌ No | ✅ Yes |
| **Squoosh** | ❌ Manual only | ❌ No | ❌ No | ❌ No | ❌ No |
| **Inkscape Export** | ✅ Yes | ❌ No | ❌ Manual | ❌ No | ❌ No |
| **Svg-weboptimizer** | ✅ Yes | ✅ Yes | ✅ Yes | ✅ Yes | ✅ Yes |

## INSTALLATION

Clone this repo:

```bash
git clone https://github.com/medvind2140/svg-weboptimizer.git
cd svg-weboptimizer
```

Install globally:

```bash
npm install -g .
```

Now you can run it from any folder.

## USAGE

From any folder with `.svg` files:

```bash
svg-weboptimizer
```

Or specify files:

```bash
svg-weboptimizer icon-home.svg icon-user.svg
```

Optimized versions are saved in a new `./optimized/` folder.

## WHAT IT DOES UNDER THE HOOD

- Uses `fast-glob` to find files
- Parses SVG with `jsdom`
- Replaces `fill="#..."` and inline styles with `fill: currentColor`
- Removes unnecessary attributes and elements
- Applies basic SVGO optimizations (without touching viewBox or custom styling)

## AI ASSISTANT
Qwen

## LICENSE
MIT

