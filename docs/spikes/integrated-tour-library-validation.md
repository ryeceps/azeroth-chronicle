# Integrated tour library validation

Desktop 1440×900 and phone 390×844 homepage/library screenshots were inspected locally. Era-entry offshoots and 22-scene Scepter insertion/return were verified with Previous, pause, reload, silent autoplay and audio completion. The new itinerary unit test checks every playable guide chapter appears once and excludes previews.

Linux visual baselines were refreshed from actual screenshots in GitHub Actions run 36797358663, commit a9f961f, artifact 11134187599. Both screenshots were inspected before copying. Changes are the Tours/Archive navigation and updated era offshoot explanatory text; Windows captures were not used as Linux baselines.

The first Linux pass found the former storyline filter URL in one acceptance assertion and an automatic location-focus camera overriding authored chapter framing. Guided read-only scenes now preserve the chapter camera; free/internal map focus still uses its existing location camera. No acceptance assertions or screenshot tolerances were relaxed.
