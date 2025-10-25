# Astro Troubleshooting Guide

This reference provides detailed solutions for common Astro issues in Spanish Academic 2026.

## Dev Server Issues

### ERR_CONNECTION_REFUSED

**Symptoms:**
- Browser shows "This site can't be reached"
- `localhost refused to connect`

**Causes & Solutions:**

1. **Server not running**
   ```bash
   # Check if process is running
   ps aux | grep astro

   # Start server
   cd ../spanish-academic-astro-integrate
   npx astro dev
   ```

2. **Wrong port**
   ```javascript
   // Check astro.config.mjs
   export default defineConfig({
     server: { port: 4321 }  // Verify this matches URL
   });
   ```

3. **Firewall blocking**
   ```javascript
   // Enable network access
   export default defineConfig({
     server: {
       port: 4321,
       host: true  // Exposes to 0.0.0.0
     }
   });
   ```

### Port Already in Use

**Error:** `Port 4321 is already in use`

**Solution:**
```bash
# Find process using port
lsof -i :4321  # macOS/Linux
netstat -ano | findstr :4321  # Windows

# Kill process or change port
export default defineConfig({
  server: { port: 4322 }
});
```

### Hot Reload Not Working

**Symptoms:** Changes don't reflect in browser

**Solutions:**

1. **Clear Astro cache**
   ```bash
   rm -rf .astro
   npx astro dev
   ```

2. **Check file watchers**
   ```bash
   # Increase limit (Linux)
   echo fs.inotify.max_user_watches=524288 | sudo tee -a /etc/sysctl.conf
   sudo sysctl -p
   ```

3. **Restart dev server**
   ```bash
   # Ctrl+C to stop
   npx astro dev
   ```

---

## Build Errors

### Cannot find module

**Error:** `Cannot find module '@/components/Header.astro'`

**Solutions:**

1. **Check path alias in tsconfig.json**
   ```json
   {
     "compilerOptions": {
       "baseUrl": ".",
       "paths": {
         "@/*": ["src/*"]
       }
     }
   }
   ```

2. **Verify file exists**
   ```bash
   ls src/components/Header.astro
   ```

3. **Use relative path**
   ```astro
   ---
   import Header from '../components/Header.astro';
   ---
   ```

### Unexpected token

**Error:** `Unexpected token '<' or 'export'`

**Cause:** Importing Astro component in non-Astro context

**Solution:**
```astro
<!-- Wrong: Can't import .astro in .tsx -->
import MyAstro from './MyComponent.astro';  // ❌

<!-- Correct: Import in .astro file -->
---
import MyAstro from './MyComponent.astro';  // ✅
---
```

---

## React Integration Issues

### React Component Not Rendering

**Symptoms:** Blank space where component should be

**Causes & Solutions:**

1. **Missing client directive**
   ```astro
   <!-- Wrong -->
   <MyComponent />

   <!-- Correct -->
   <MyComponent client:load />
   ```

2. **Wrong integration**
   ```bash
   # Verify @astrojs/react is installed
   npm list @astrojs/react

   # Install if missing
   npx astro add react
   ```

3. **Component error (check browser console)**
   ```javascript
   // Add error boundary in React component
   import { ErrorBoundary } from 'react-error-boundary';
   ```

### Hydration Mismatch

**Error:** `Hydration failed because the initial UI does not match...`

**Causes:**

1. **Client-only code in server render**
   ```tsx
   // Wrong: window not available on server
   const width = window.innerWidth;

   // Correct: Check environment
   const width = typeof window !== 'undefined' ? window.innerWidth : 0;
   ```

2. **Different markup server vs client**
   ```tsx
   // Use client:only if component requires browser
   <BrowserOnlyWidget client:only="react" />
   ```

### Props Not Passing

**Issue:** React component receives undefined props

**Solution:**
```astro
---
// Ensure props are defined before passing
const myData = {
  title: 'Hello',
  items: ['a', 'b', 'c']
};
---

<!-- Pass as explicit props -->
<MyComponent
  title={myData.title}
  items={myData.items}
  client:load
/>
```

---

## Content Collections Issues

### Schema Validation Failed

**Error:** `[slug] Invalid input: Expected string, received number`

**Solutions:**

1. **Check data type**
   ```typescript
   // Define correct schema
   const collection = defineCollection({
     schema: z.object({
       id: z.string(),  // Must match data type
       count: z.number()
     })
   });
   ```

2. **Coerce types**
   ```typescript
   schema: z.object({
     pubDate: z.coerce.date(),  // Converts string to Date
     views: z.coerce.number()   // Converts string to number
   })
   ```

### Collection Not Found

**Error:** `Collection "programs" does not exist`

**Solutions:**

1. **Create content config**
   ```typescript
   // src/content/config.ts
   import { defineCollection } from 'astro:content';

   const programs = defineCollection({ /* ... */ });

   export const collections = { programs };
   ```

2. **Check directory structure**
   ```
   src/content/
   └── programs/
       ├── program-1.json
       └── program-2.json
   ```

### getStaticPaths with Collections

**Issue:** Dynamic routes not generating

**Solution:**
```astro
---
import { getCollection } from 'astro:content';

export async function getStaticPaths() {
  const programs = await getCollection('programs');

  return programs.map(program => ({
    params: { slug: program.id },
    props: { program }
  }));
}

const { program } = Astro.props;
---
```

---

## TypeScript Issues

### Type Errors in .astro Files

**Error:** `Property 'data' does not exist`

**Solutions:**

1. **Generate types**
   ```bash
   npx astro sync  # Generates .astro/ types
   ```

2. **Extend tsconfig**
   ```json
   {
     "extends": "astro/tsconfigs/strict"
   }
   ```

3. **Install Astro VSCode extension**
   - Extension ID: `astro-build.astro-vscode`

### Astro.props Type Error

**Issue:** Can't infer props type

**Solution:**
```astro
---
interface Props {
  title: string;
  count?: number;
}

const { title, count = 0 } = Astro.props;
---
```

---

## Performance Issues

### Slow Build Times

**Symptoms:** `astro build` takes >2 minutes

**Solutions:**

1. **Check for large collections**
   ```typescript
   // Limit in development
   const programs = import.meta.env.DEV
     ? await getCollection('programs').slice(0, 10)
     : await getCollection('programs');
   ```

2. **Enable caching**
   ```javascript
   export default defineConfig({
     vite: {
       build: {
         chunkSizeWarningLimit: 1000
       }
     }
   });
   ```

3. **Use static mode for SSG**
   ```javascript
   export default defineConfig({
     output: 'static'  // Faster than 'server'
   });
   ```

### Large Bundle Size

**Warning:** `Chunk size exceeds 500KB`

**Solutions:**

1. **Lazy load React components**
   ```astro
   <HeavyComponent client:visible />  <!-- Load when scrolled into view -->
   ```

2. **Code splitting**
   ```javascript
   // Dynamic import
   const HeavyModule = await import('./heavy-module');
   ```

3. **Check bundle stats**
   ```bash
   npm run build
   # Check lighthouse-reports/bundle-stats.html
   ```

---

## Common Configuration Mistakes

### Missing Integration

**Issue:** React/Vue components don't work

**Solution:**
```bash
npx astro add react
# Or
npx astro add vue
```

### Wrong Output Directory

**Issue:** Build outputs to wrong location

**Solution:**
```javascript
export default defineConfig({
  build: {
    outDir: './dist'  // Default is ./dist/
  }
});
```

### Public Assets Not Copying

**Issue:** Files in `public/` not in build

**Solution:**
```javascript
// Check publicDir setting
export default defineConfig({
  publicDir: './public'  // Default
});

// Verify structure
public/
├── favicon.ico
└── robots.txt
```

---

## Debugging Checklist

When encountering any Astro issue:

- [ ] Restart dev server (`npx astro dev`)
- [ ] Clear Astro cache (`rm -rf .astro`)
- [ ] Check `astro.config.mjs` syntax
- [ ] Verify all integrations installed (`npx astro add <integration>`)
- [ ] Run `npx astro check` for type errors
- [ ] Check browser console for client errors
- [ ] Review terminal output for build errors
- [ ] Consult https://docs.astro.build/en/getting-started/
- [ ] Search error message in Astro Discord/GitHub issues

---

## Spanish Academic Specific Issues

### JSON Twin Generation Fails

**Issue:** `generate_page_json.js` can't parse Astro output

**Solution:**
```bash
# Ensure Astro builds to correct location
npm run build  # Astro build
npm run generate-json  # Then generate twins
```

### HTML Size Check Fails

**Issue:** Astro pages exceed 50KB limit

**Solutions:**

1. **Remove dev-only scripts**
   ```javascript
   export default defineConfig({
     build: {
       inlineStylesheets: 'never'  // External CSS
     }
   });
   ```

2. **Split large pages**
   ```astro
   <!-- Lazy load below-fold content -->
   <HeavySection client:visible />
   ```

### Vite + Astro Conflict

**Issue:** Both dev servers interfere

**Solution:**
```bash
# Run on different ports (already configured)
npm run dev      # Vite on :3000
npx astro dev    # Astro on :4321

# Or run separately in different terminals
```

---

**Last Updated:** 2025-10-25
**Astro Version:** 5.15.1
