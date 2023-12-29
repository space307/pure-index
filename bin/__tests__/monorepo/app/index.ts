import { getRoot } from 'package-d'
import { createRoot } from 'react-dom/client'

import { Component } from 'package-b'

createRoot(getRoot()).render(Component)
