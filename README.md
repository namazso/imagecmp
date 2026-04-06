# ImgCmp

A client-side image comparison tool. All comparison data is encoded in the URL fragment — no server storage, no uploads, no accounts.

Live at [imgcmp.com](https://imgcmp.com/).

## How It Works

Create a gallery by specifying image URLs, source labels, and scene names. The tool encodes the gallery definition into a compact URL hash using deflate + base64url. Anyone with the link can view the comparison — no backend required.

Supports two comparison modes:
- **Clicker**: Click to cycle between sources (with optional checkbox overlay filtering).
- **Slider**: Drag a slider to reveal two sources side-by-side.

## Tech Stack

- [Next.js](https://nextjs.org/) (static export)
- [React 19](https://react.dev/)
- [Tailwind CSS v4](https://tailwindcss.com/)
- [fflate](https://github.com/101arrowz/fflate) for compression

## Development

```bash
npm install
npm run dev
```

Build for production (static export to `out/`):

```bash
npm run build
```

## License

See [LICENSE](LICENSE) for details.
