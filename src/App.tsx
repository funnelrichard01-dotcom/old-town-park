/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import ParallaxDemo from './demos/default';

export default function App() {
  return (
    <div id="parallax-app-root" className="min-h-screen bg-black text-white selection:bg-white selection:text-black">
      <ParallaxDemo />
    </div>
  );
}
