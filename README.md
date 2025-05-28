# alcvisualizer.io

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Apex Legends ALC Settings Visualizer - Pro Edition</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background-color: #0a0a0a;
            color: #e0e0e0;
            line-height: 1.6;
            overflow-x: hidden;
        }
        
        .container {
            max-width: 1600px;
            margin: 0 auto;
            padding: 20px;
        }
        
        header {
            text-align: center;
            margin-bottom: 30px;
            background: linear-gradient(135deg, #ff4444 0%, #cc0000 100%);
            padding: 20px;
            border-radius: 10px;
        }
        
        h1 {
            font-size: 2.5em;
            margin-bottom: 10px;
            text-shadow: 2px 2px 4px rgba(0,0,0,0.5);
        }
        
        .subtitle {
            font-size: 1.1em;
            opacity: 0.9;
        }
        
        .main-grid {
            display: grid;
            grid-template-columns: 1fr 1fr 1fr;
            gap: 20px;
            margin-bottom: 20px;
        }
        
        @media (max-width: 1200px) {
            .main-grid {
                grid-template-columns: 1fr 1fr;
            }
        }
        
        @media (max-width: 768px) {
            .main-grid {
                grid-template-columns: 1fr;
            }
        }
        
        .panel {
            background-color: #1a1a1a;
            border-radius: 10px;
            padding: 20px;
            box-shadow: 0 4px 6px rgba(0,0,0,0.3);
            border: 1px solid #333;
        }
        
        .panel h2 {
            color: #ff4444;
            margin-bottom: 15px;
            font-size: 1.5em;
            border-bottom: 2px solid #ff4444;
            padding-bottom: 10px;
        }
        
        .settings-section {
            margin-bottom: 25px;
            padding: 15px;
            background-color: #222;
            border-radius: 8px;
        }
        
        .settings-section h3 {
            color: #ff7777;
            margin-bottom: 15px;
            font-size: 1.2em;
        }
        
        .slider-group {
            margin-bottom: 20px;
        }
        
        .slider-label {
            display: flex;
            justify-content: space-between;
            margin-bottom: 5px;
            font-weight: 500;
        }
        
        .slider-value {
            color: #ff4444;
            font-weight: bold;
            min-width: 50px;
            text-align: right;
        }
        
        input[type="range"] {
            width: 100%;
            height: 8px;
            background: #333;
            outline: none;
            opacity: 0.8;
            transition: opacity 0.2s;
            border-radius: 4px;
            cursor: pointer;
        }
        
        input[type="range"]:hover {
            opacity: 1;
        }
        
        input[type="range"]::-webkit-slider-thumb {
            -webkit-appearance: none;
            appearance: none;
            width: 20px;
            height: 20px;
            background: #ff4444;
            cursor: pointer;
            border-radius: 50%;
            box-shadow: 0 0 5px rgba(255,68,68,0.5);
        }
        
        input[type="range"]::-moz-range-thumb {
            width: 20px;
            height: 20px;
            background: #ff4444;
            cursor: pointer;
            border-radius: 50%;
            box-shadow: 0 0 5px rgba(255,68,68,0.5);
        }
        
        select {
            width: 100%;
            padding: 8px;
            background-color: #333;
            color: #e0e0e0;
            border: 1px solid #555;
            border-radius: 4px;
            font-size: 16px;
            cursor: pointer;
        }
        
        .canvas-container {
            background-color: #0a0a0a;
            border-radius: 8px;
            padding: 10px;
            margin-top: 10px;
            border: 1px solid #333;
        }
        
        canvas {
            display: block;
            margin: 0 auto;
            background-color: #111;
            border-radius: 4px;
        }
        
        .visualization-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 20px;
            margin-bottom: 20px;
        }
        
        .info-box {
            background-color: #222;
            padding: 15px;
            border-radius: 8px;
            margin-top: 10px;
            border-left: 4px solid #ff4444;
        }
        
        .info-box h3 {
            color: #ff4444;
            margin-bottom: 8px;
        }
        
        .info-box p {
            font-size: 0.9em;
            line-height: 1.5;
            opacity: 0.9;
            margin: 5px 0;
        }
        
        .button-group {
            display: flex;
            gap: 10px;
            margin-top: 20px;
            flex-wrap: wrap;
        }
        
        button {
            padding: 10px 20px;
            background-color: #ff4444;
            color: white;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            font-size: 16px;
            font-weight: 500;
            transition: all 0.3s;
        }
        
        button:hover {
            background-color: #cc0000;
            transform: translateY(-2px);
            box-shadow: 0 4px 8px rgba(255,68,68,0.3);
        }
        
        .preset-select {
            margin-bottom: 15px;
        }
        
        .help-text {
            font-size: 0.85em;
            color: #999;
            margin-top: 5px;
        }
        
        .legend {
            display: flex;
            justify-content: center;
            gap: 20px;
            margin-top: 10px;
            font-size: 0.9em;
            flex-wrap: wrap;
        }
        
        .legend-item {
            display: flex;
            align-items: center;
            gap: 5px;
        }
        
        .legend-color {
            width: 20px;
            height: 20px;
            border-radius: 3px;
        }
        
        .tab-buttons {
            display: flex;
            gap: 10px;
            margin-bottom: 20px;
        }
        
        .tab-button {
            padding: 8px 16px;
            background-color: #333;
            color: #aaa;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            transition: all 0.3s;
        }
        
        .tab-button.active {
            background-color: #ff4444;
            color: white;
        }
        
        .tab-content {
            display: none;
        }
        
        .tab-content.active {
            display: block;
        }

        .viz-tabs {
            display: flex;
            gap: 5px;
            margin-bottom: 15px;
            background-color: #222;
            padding: 5px;
            border-radius: 8px;
        }

        .viz-tab {
            padding: 8px 16px;
            background-color: transparent;
            color: #999;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            transition: all 0.3s;
            font-size: 14px;
        }

        .viz-tab.active {
            background-color: #ff4444;
            color: white;
        }

        .viz-content {
            display: none;
        }

        .viz-content.active {
            display: block;
        }

        .curve-type-indicator {
            font-size: 0.9em;
            color: #ff7777;
            margin-left: 10px;
            font-style: italic;
        }

        .aa-mode-toggle {
            display: flex;
            gap: 10px;
            margin-bottom: 15px;
            align-items: center;
        }

        .aa-mode-toggle button {
            padding: 5px 15px;
            font-size: 14px;
        }

        .aa-mode-toggle button.active {
            background-color: #ff7777;
        }

        .warning {
            padding: 8px 12px;
            border-radius: 5px;
            margin-top: 5px;
            font-size: 0.85em;
            font-weight: 500;
            display: flex;
            align-items: center;
            gap: 5px;
        }

        .warning-red {
            background-color: #ff333333;
            border: 1px solid #ff3333;
            color: #ff6666;
        }

        .warning-yellow {
            background-color: #ffaa0033;
            border: 1px solid #ffaa00;
            color: #ffcc00;
        }

        .warning-green {
            background-color: #00ff3333;
            border: 1px solid #00ff33;
            color: #00ff66;
        }

        .pro-tip {
            background-color: #442222;
            border: 1px solid #664444;
            padding: 10px;
            border-radius: 5px;
            margin: 10px 0;
            font-size: 0.9em;
        }

        .pro-tip-title {
            color: #ff7777;
            font-weight: bold;
            margin-bottom: 5px;
        }

        .stats-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 10px;
            margin-top: 15px;
        }

        .stat-box {
            background-color: #333;
            padding: 10px;
            border-radius: 5px;
            text-align: center;
        }

        .stat-label {
            font-size: 0.8em;
            color: #999;
        }

        .stat-value {
            font-size: 1.2em;
            color: #ff7777;
            font-weight: bold;
        }

        .comparison-bar {
            height: 20px;
            background-color: #333;
            border-radius: 10px;
            overflow: hidden;
            margin: 5px 0;
            position: relative;
        }

        .comparison-fill {
            height: 100%;
            background: linear-gradient(90deg, #ff4444, #ff7777);
            transition: width 0.3s;
        }

        .comparison-label {
            position: absolute;
            right: 10px;
            top: 50%;
            transform: translateY(-50%);
            font-size: 0.8em;
            color: #fff;
        }

        .diagonal-uniformity-box {
            background-color: #2a2a2a;
            padding: 15px;
            border-radius: 8px;
            margin-top: 15px;
            border: 2px solid #444;
        }

        .uniformity-status {
            font-size: 1.1em;
            font-weight: bold;
            margin-bottom: 10px;
        }

        .uniformity-good {
            color: #00ff66;
        }

        .uniformity-warning {
            color: #ffcc00;
        }

        .uniformity-bad {
            color: #ff6666;
        }

        .aa-analysis-section {
            background-color: #1a1a1a;
            padding: 15px;
            border-radius: 8px;
            margin-bottom: 15px;
            border: 1px solid #333;
        }

        .aa-analysis-title {
            color: #ff7777;
            font-weight: bold;
            font-size: 1.1em;
            margin-bottom: 15px;
            padding-bottom: 10px;
            border-bottom: 1px solid #444;
        }

        .aa-meter-group {
            margin-bottom: 20px;
        }

        .aa-meter-label {
            font-weight: bold;
            color: #ff9999;
            margin-bottom: 5px;
        }

        .aa-profile-box {
            background-color: #2a2a2a;
            padding: 15px;
            border-radius: 8px;
            margin-top: 20px;
            border: 2px solid #444;
        }

        .aa-profile-title {
            color: #ff7777;
            font-weight: bold;
            font-size: 1.1em;
            margin-bottom: 10px;
        }

        .aa-profile-text {
            line-height: 1.6;
        }

        .aa-meter-description {
            font-size: 0.85em;
            color: #aaa;
            margin-top: 3px;
        }
    </style>
</head>
<body>
    <div class="container">
        <header>
            <h1>Apex Legends ALC Settings Visualizer - Pro Edition</h1>
            <p class="subtitle">Advanced visualization and analysis for competitive controller settings</p>
        </header>

        <div class="main-grid">
            <!-- Left Panel - Controls -->
            <div class="panel">
                <h2>ALC Settings</h2>
                
                <div class="preset-select">
                    <label for="presets">Load Preset:</label>
                    <select id="presets">
                        <option value="custom">Custom</option>
                        <option value="default">Game Default</option>
                        <option value="linear">Pro Linear</option>
                        <option value="genburten">Genburten Settings</option>
                        <option value="verhulst">Verhulst Settings</option>
                        <option value="snipedown">Snip3down Settings</option>
                    </select>
                </div>

                <div class="tab-buttons">
                    <button class="tab-button active" onclick="switchTab('hipfire')">Hip Fire</button>
                    <button class="tab-button" onclick="switchTab('ads')">ADS</button>
                </div>

                <!-- Hip Fire Settings -->
                <div id="hipfire-tab" class="tab-content active">
                    <div class="settings-section">
                        <h3>Deadzone Settings</h3>
                        
                        <div class="slider-group">
                            <div class="slider-label">
                                <span>Look Deadzone</span>
                                <span class="slider-value" id="deadzoneValue">15%</span>
                            </div>
                            <input type="range" id="deadzone" min="0" max="50" value="15" step="1">
                            <p class="help-text">Lower = Better micro-adjustments. Stick drift doesn't affect aim!</p>
                        </div>

                        <div class="slider-group">
                            <div class="slider-label">
                                <span>Outer Threshold</span>
                                <span class="slider-value" id="outerThresholdValue">2%</span>
                            </div>
                            <input type="range" id="outerThreshold" min="0" max="30" value="2" step="1">
                            <div id="outerThresholdWarning"></div>
                        </div>

                        <div class="slider-group">
                            <div class="slider-label">
                                <span>Response Curve</span>
                                <span class="slider-value" id="responseCurveValue">10</span>
                                <span class="curve-type-indicator" id="curveTypeIndicator">(Classic)</span>
                            </div>
                            <input type="range" id="responseCurve" min="0" max="30" value="10" step="1">
                            <p class="help-text">0: Linear (Pro) | 10: Classic (Forgiving) | 20+: Heavy curve</p>
                        </div>
                    </div>

                    <div class="settings-section">
                        <h3>Look Speed</h3>
                        
                        <div class="slider-group">
                            <div class="slider-label">
                                <span>Yaw Speed (Horizontal)</span>
                                <span class="slider-value" id="yawSpeedValue">160</span>
                            </div>
                            <input type="range" id="yawSpeed" min="0" max="500" value="160" step="1">
                            <div id="hipYawWarning"></div>
                        </div>

                        <div class="slider-group">
                            <div class="slider-label">
                                <span>Pitch Speed (Vertical)</span>
                                <span class="slider-value" id="pitchSpeedValue">120</span>
                            </div>
                            <input type="range" id="pitchSpeed" min="0" max="500" value="120" step="1">
                            <div id="hipPitchWarning"></div>
                        </div>
                    </div>

                    <div class="settings-section">
                        <h3>Turning Extra</h3>
                        
                        <div class="slider-group">
                            <div class="slider-label">
                                <span>Turning Extra Yaw</span>
                                <span class="slider-value" id="extraYawValue">220</span>
                            </div>
                            <input type="range" id="extraYaw" min="0" max="250" value="220" step="1">
                        </div>

                        <div class="slider-group">
                            <div class="slider-label">
                                <span>Turning Extra Pitch</span>
                                <span class="slider-value" id="extraPitchValue">0</span>
                            </div>
                            <input type="range" id="extraPitch" min="0" max="250" value="0" step="1">
                        </div>

                        <div class="slider-group">
                            <div class="slider-label">
                                <span>Ramp-up Time</span>
                                <span class="slider-value" id="rampTimeValue">33%</span>
                            </div>
                            <input type="range" id="rampTime" min="0" max="100" value="33" step="1">
                            <div id="hipRampWarning"></div>
                        </div>

                        <div class="slider-group">
                            <div class="slider-label">
                                <span>Ramp-up Delay</span>
                                <span class="slider-value" id="rampDelayValue">0%</span>
                            </div>
                            <input type="range" id="rampDelay" min="0" max="100" value="0" step="1">
                        </div>
                    </div>
                </div>

                <!-- ADS Settings -->
                <div id="ads-tab" class="tab-content">
                    <div class="settings-section">
                        <h3>ADS Look Speed</h3>
                        
                        <div class="slider-group">
                            <div class="slider-label">
                                <span>ADS Yaw Speed</span>
                                <span class="slider-value" id="adsYawSpeedValue">110</span>
                            </div>
                            <input type="range" id="adsYawSpeed" min="0" max="500" value="110" step="1">
                            <div id="adsYawWarning"></div>
                        </div>

                        <div class="slider-group">
                            <div class="slider-label">
                                <span>ADS Pitch Speed</span>
                                <span class="slider-value" id="adsPitchSpeedValue">75</span>
                            </div>
                            <input type="range" id="adsPitchSpeed" min="0" max="500" value="75" step="1">
                            <div id="adsPitchWarning"></div>
                        </div>
                    </div>

                    <div class="settings-section">
                        <h3>ADS Turning Extra</h3>
                        
                        <div class="slider-group">
                            <div class="slider-label">
                                <span>ADS Turning Extra Yaw</span>
                                <span class="slider-value" id="adsExtraYawValue">30</span>
                            </div>
                            <input type="range" id="adsExtraYaw" min="0" max="250" value="30" step="1">
                        </div>

                        <div class="slider-group">
                            <div class="slider-label">
                                <span>ADS Turning Extra Pitch</span>
                                <span class="slider-value" id="adsExtraPitchValue">30</span>
                            </div>
                            <input type="range" id="adsExtraPitch" min="0" max="250" value="30" step="1">
                        </div>

                        <div class="slider-group">
                            <div class="slider-label">
                                <span>ADS Ramp-up Time</span>
                                <span class="slider-value" id="adsRampTimeValue">100%</span>
                            </div>
                            <input type="range" id="adsRampTime" min="0" max="100" value="100" step="1">
                            <div id="adsRampWarning"></div>
                        </div>

                        <div class="slider-group">
                            <div class="slider-label">
                                <span>ADS Ramp-up Delay</span>
                                <span class="slider-value" id="adsRampDelayValue">25%</span>
                            </div>
                            <input type="range" id="adsRampDelay" min="0" max="100" value="25" step="1">
                        </div>
                    </div>
                </div>

                <div class="button-group">
                    <button onclick="resetSettings()">Reset to Default</button>
                    <button onclick="exportSettings()">Export Settings</button>
                    <button onclick="importSettings()">Import Settings</button>
                </div>
            </div>

            <!-- Middle Panel - Visualizations -->
            <div class="panel">
                <h2>Visualizations</h2>
                
                <div class="viz-tabs">
                    <button class="viz-tab active" onclick="switchVizTab('core')">Core</button>
                    <button class="viz-tab" onclick="switchVizTab('movement')">Movement</button>
                    <button class="viz-tab" onclick="switchVizTab('aimassist')">Aim Assist</button>
                    <button class="viz-tab" onclick="switchVizTab('metrics')">Metrics</button>
                </div>

                <!-- Core Tab -->
                <div id="core-viz" class="viz-content active">
                    <div class="visualization-grid">
                        <div>
                            <h3 style="color: #ff7777; margin-bottom: 10px;">Deadzone Map</h3>
                            <div class="canvas-container">
                                <canvas id="deadzoneCanvas" width="250" height="250"></canvas>
                            </div>
                            <div class="legend">
                                <div class="legend-item">
                                    <div class="legend-color" style="background-color: #ff000066;"></div>
                                    <span>Deadzone</span>
                                </div>
                                <div class="legend-item">
                                    <div class="legend-color" style="background-color: #00ff0066;"></div>
                                    <span>Active</span>
                                </div>
                                <div class="legend-item">
                                    <div class="legend-color" style="background-color: #ffff0066;"></div>
                                    <span>Outer</span>
                                </div>
                            </div>
                        </div>
                        
                        <div>
                            <h3 style="color: #ff7777; margin-bottom: 10px;">Response Curve</h3>
                            <div class="canvas-container">
                                <canvas id="curveCanvas" width="250" height="250"></canvas>
                            </div>
                            <p class="help-text" style="text-align: center; margin-top: 10px;">
                                Input vs Output - Shows acceleration
                            </p>
                        </div>
                    </div>
                </div>

                <!-- Movement Tab -->
                <div id="movement-viz" class="viz-content">
                    <div>
                        <h3 style="color: #ff7777; margin-bottom: 10px;">Strafe Tracking Analysis</h3>
                        <div class="canvas-container">
                            <canvas id="strafeCanvas" width="520" height="250"></canvas>
                        </div>
                        <div class="legend">
                            <div class="legend-item">
                                <div class="legend-color" style="background-color: #00ff00;"></div>
                                <span>Can Track</span>
                            </div>
                            <div class="legend-item">
                                <div class="legend-color" style="background-color: #ffff00;"></div>
                                <span>Difficult</span>
                            </div>
                            <div class="legend-item">
                                <div class="legend-color" style="background-color: #ff0000;"></div>
                                <span>Cannot Track</span>
                            </div>
                        </div>
                    </div>

                    <div style="margin-top: 20px;">
                        <h3 style="color: #ff7777; margin-bottom: 10px;">Diagonal Uniformity</h3>
                        <div class="canvas-container">
                            <canvas id="diagonalCanvas" width="520" height="250"></canvas>
                        </div>
                        <div id="diagonalAnalysis" class="diagonal-uniformity-box">
                            <div id="uniformityStatus" class="uniformity-status">Loading...</div>
                            <p id="uniformityText">Analyzing diagonal movement...</p>
                        </div>
                    </div>
                </div>

                <!-- Aim Assist Tab -->
                <div id="aimassist-viz" class="viz-content">
                    <div>
                        <h3 style="color: #ff7777; margin-bottom: 10px;">Aim Assist Behavior (0.3 PC Controller)</h3>
                        <div class="aa-mode-toggle">
                            <span>View Mode:</span>
                            <button class="active" onclick="setAAMode('hipfire')">Hip Fire</button>
                            <button onclick="setAAMode('ads')">ADS</button>
                        </div>
                        <div class="canvas-container">
                            <canvas id="aimAssistCanvas" width="520" height="300"></canvas>
                        </div>
                        <div class="info-box">
                            <h3>Aim Assist Mechanics</h3>
                            <div id="aaInfoContent">
                                <p>• <strong>Hip Fire Range:</strong> 3m to 33m (No AA under 3m or over 33m)</p>
                                <p>• <strong>AA Strength:</strong> 30% relative position maintenance within AA bubble</p>
                                <p>• <strong>Bubble Size:</strong> Scales with enemy distance (smaller at range)</p>
                                <p>• <strong>No Direct Assistance:</strong> No recoil control or bullet drop compensation</p>
                                <p>• Lower response curves provide smoother tracking within AA bubble</p>
                            </div>
                        </div>
                    </div>

                    <div class="aa-analysis-section" style="margin-top: 20px;">
                        <div class="aa-analysis-title">AA Dependency & Retention Analysis</div>
                        
                        <div class="aa-meter-group">
                            <div class="aa-meter-label" id="hipAALabel">Hip Fire (160°/s)</div>
                            <div style="margin-bottom: 10px;">
                                <p style="margin-bottom: 5px;">Dependency:</p>
                                <div class="comparison-bar" style="background-color: #2a2a3e;">
                                    <div class="comparison-fill" id="hipDependencyBar" style="width: 50%; background: linear-gradient(90deg, #6666ff, #9999ff);"></div>
                                    <span class="comparison-label" id="hipDependencyLabel">50%</span>
                                </div>
                                <p class="aa-meter-description" id="hipDependencyDesc">How much you need AA to track effectively</p>
                            </div>
                            <div>
                                <p style="margin-bottom: 5px;">Retention:</p>
                                <div class="comparison-bar" style="background-color: #2a2a3e;">
                                    <div class="comparison-fill" id="hipRetentionBar" style="width: 50%; background: linear-gradient(90deg, #6666ff, #9999ff);"></div>
                                    <span class="comparison-label" id="hipRetentionLabel">50%</span>
                                </div>
                                <p class="aa-meter-description" id="hipRetentionDesc">How difficult to accidentally exit AA bubble</p>
                            </div>
                        </div>

                        <div class="aa-meter-group" style="margin-top: 20px;">
                            <div class="aa-meter-label" id="adsAALabel">ADS (110°/s)</div>
                            <div style="margin-bottom: 10px;">
                                <p style="margin-bottom: 5px;">Dependency:</p>
                                <div class="comparison-bar" style="background-color: #2a2a3e;">
                                    <div class="comparison-fill" id="adsDependencyBar" style="width: 50%; background: linear-gradient(90deg, #6666ff, #9999ff);"></div>
                                    <span class="comparison-label" id="adsDependencyLabel">50%</span>
                                </div>
                                <p class="aa-meter-description" id="adsDependencyDesc">How much you need AA to track effectively</p>
                            </div>
                            <div>
                                <p style="margin-bottom: 5px;">Retention:</p>
                                <div class="comparison-bar" style="background-color: #2a2a3e;">
                                    <div class="comparison-fill" id="adsRetentionBar" style="width: 50%; background: linear-gradient(90deg, #6666ff, #9999ff);"></div>
                                    <span class="comparison-label" id="adsRetentionLabel">50%</span>
                                </div>
                                <p class="aa-meter-description" id="adsRetentionDesc">How difficult to accidentally exit AA bubble</p>
                            </div>
                        </div>

                        <div class="aa-profile-box">
                            <div class="aa-profile-title">Overall Profile: <span id="aaProfileType">Analyzing...</span></div>
                            <p class="aa-profile-text" id="aaProfileDescription">Loading profile analysis...</p>
                        </div>
                    </div>

                    <div style="margin-top: 20px;">
                        <h3 style="color: #ff7777; margin-bottom: 10px;">Turning Extra Activation</h3>
                        <div class="canvas-container">
                            <canvas id="turningExtraCanvas" width="520" height="200"></canvas>
                        </div>
                        <p class="help-text" style="text-align: center;">
                            Shows when acceleration kicks in (100% stick + no AA)
                        </p>
                    </div>
                </div>

                <!-- Metrics Tab -->
                <div id="metrics-viz" class="viz-content">
                    <div class="stats-grid">
                        <div class="stat-box">
                            <div class="stat-label">Hip 180° Time</div>
                            <div class="stat-value" id="hip180Time">0.00s</div>
                        </div>
                        <div class="stat-box">
                            <div class="stat-label">Hip 180° w/ Extra</div>
                            <div class="stat-value" id="hip180TimeExtra">0.00s</div>
                        </div>
                        <div class="stat-box">
                            <div class="stat-label">ADS 180° Time</div>
                            <div class="stat-value" id="ads180Time">0.00s</div>
                        </div>
                        <div class="stat-box">
                            <div class="stat-label">ADS 180° w/ Extra</div>
                            <div class="stat-value" id="ads180TimeExtra">0.00s</div>
                        </div>
                    </div>

                    <div class="info-box" style="margin-top: 20px;">
                        <h3>Speed Breakdown</h3>
                        <p>Hip Fire Base: <span id="hipBaseSpeed" style="color: #ff7777;">160°/s</span></p>
                        <p>Hip Fire Max: <span id="hipMaxSpeed" style="color: #ff7777;">380°/s</span></p>
                        <p>ADS Base: <span id="adsBaseSpeed" style="color: #ff7777;">110°/s</span></p>
                        <p>ADS Max: <span id="adsMaxSpeed" style="color: #ff7777;">140°/s</span></p>
                    </div>

                    <div style="margin-top: 20px;">
                        <h3 style="color: #ff7777; margin-bottom: 10px;">Effective Speed Comparison</h3>
                        <div class="canvas-container">
                            <canvas id="speedComparisonCanvas" width="520" height="300"></canvas>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Right Panel - Analysis & Tips -->
            <div class="panel">
                <h2>Analysis & Pro Tips</h2>
                
                <div class="info-box">
                    <h3>Current Settings Analysis</h3>
                    <div id="analysisText">Loading analysis...</div>
                </div>

                <div class="info-box" style="margin-top: 15px;">
                    <h3>Diagonal Uniformity Score</h3>
                    <div id="diagonalUniformity">
                        <p>Hip Fire Uniformity:</p>
                        <div class="comparison-bar">
                            <div class="comparison-fill" id="hipUniformityBar" style="width: 75%"></div>
                            <span class="comparison-label" id="hipUniformityLabel">75%</span>
                        </div>
                        <p style="margin-top: 10px;">ADS Uniformity:</p>
                        <div class="comparison-bar">
                            <div class="comparison-fill" id="adsUniformityBar" style="width: 68%"></div>
                            <span class="comparison-label" id="adsUniformityLabel">68%</span>
                        </div>
                        <p class="help-text" style="margin-top: 10px;">Pro players maintain 80-100% for consistent diagonal tracking</p>
                    </div>
                </div>

                <div class="info-box" style="margin-top: 15px;">
                    <h3>Micro-adjustment Capability</h3>
                    <div id="microAdjustment">
                        <p>Deadzone Impact:</p>
                        <div class="comparison-bar">
                            <div class="comparison-fill" id="microBar" style="width: 50%"></div>
                            <span class="comparison-label" id="microLabel">50%</span>
                        </div>
                        <p class="help-text" id="microText">Lower deadzone = better micro-adjustments</p>
                    </div>
                </div>

                <div class="pro-tip">
                    <div class="pro-tip-title">💡 Hidden Decimals</div>
                    <p>Manually clicking values in-game (instead of D-pad) adds hidden decimals that persist. Set to 0 or edit config to remove them.</p>
                </div>

                <div class="pro-tip">
                    <div class="pro-tip-title">🎯 Why Lower Deadzone?</div>
                    <p>Smaller deadzone = more precision with less stick movement. Stick drift doesn't impact aim - it only causes visual movement when not aiming.</p>
                </div>

                <div class="pro-tip">
                    <div class="pro-tip-title">📈 Linear vs Classic</div>
                    <p><strong>Linear (0):</strong> 1:1 input, best for recoil control & consistency. Higher skill ceiling.<br>
                    <strong>Classic (10):</strong> More forgiving, easier to handle, but less precise.</p>
                </div>

                <div class="pro-tip">
                    <div class="pro-tip-title">⚡ Turning Extra Secret</div>
                    <p>Only activates at 100% stick deflection AND outside aim assist range. Disabled in AA bubble for consistency.</p>
                </div>

                <div class="info-box" style="margin-top: 15px;">
                    <h3>Pro Player Comparison</h3>
                    <div id="proComparison">
                        <p>Your Yaw/Pitch vs Pro Average:</p>
                        <div class="comparison-bar">
                            <div class="comparison-fill" id="proBar" style="width: 70%"></div>
                            <span class="comparison-label" id="proLabel">70%</span>
                        </div>
                    </div>
                </div>

                <div class="info-box" style="margin-top: 15px;">
                    <h3>Effective Ranges</h3>
                    <div id="rangeAnalysis">
                        <p>🔴 Close (3-10m): <span id="closeRangeStatus">Good</span></p>
                        <p>🟡 Mid (10-30m): <span id="midRangeStatus">Good</span></p>
                        <p>🟢 Long (30m+): <span id="longRangeStatus">Good</span></p>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <script>
        // Get all elements
        const elements = {
            // Hip fire settings
            deadzone: document.getElementById('deadzone'),
            outerThreshold: document.getElementById('outerThreshold'),
            responseCurve: document.getElementById('responseCurve'),
            yawSpeed: document.getElementById('yawSpeed'),
            pitchSpeed: document.getElementById('pitchSpeed'),
            extraYaw: document.getElementById('extraYaw'),
            extraPitch: document.getElementById('extraPitch'),
            rampTime: document.getElementById('rampTime'),
            rampDelay: document.getElementById('rampDelay'),
            // ADS settings
            adsYawSpeed: document.getElementById('adsYawSpeed'),
            adsPitchSpeed: document.getElementById('adsPitchSpeed'),
            adsExtraYaw: document.getElementById('adsExtraYaw'),
            adsExtraPitch: document.getElementById('adsExtraPitch'),
            adsRampTime: document.getElementById('adsRampTime'),
            adsRampDelay: document.getElementById('adsRampDelay'),
            // Other
            presets: document.getElementById('presets')
        };

        const valueElements = {
            deadzoneValue: document.getElementById('deadzoneValue'),
            outerThresholdValue: document.getElementById('outerThresholdValue'),
            responseCurveValue: document.getElementById('responseCurveValue'),
            yawSpeedValue: document.getElementById('yawSpeedValue'),
            pitchSpeedValue: document.getElementById('pitchSpeedValue'),
            extraYawValue: document.getElementById('extraYawValue'),
            extraPitchValue: document.getElementById('extraPitchValue'),
            rampTimeValue: document.getElementById('rampTimeValue'),
            rampDelayValue: document.getElementById('rampDelayValue'),
            adsYawSpeedValue: document.getElementById('adsYawSpeedValue'),
            adsPitchSpeedValue: document.getElementById('adsPitchSpeedValue'),
            adsExtraYawValue: document.getElementById('adsExtraYawValue'),
            adsExtraPitchValue: document.getElementById('adsExtraPitchValue'),
            adsRampTimeValue: document.getElementById('adsRampTimeValue'),
            adsRampDelayValue: document.getElementById('adsRampDelayValue')
        };

        // Canvas contexts
        const deadzoneCanvas = document.getElementById('deadzoneCanvas');
        const deadzoneCtx = deadzoneCanvas.getContext('2d');
        const curveCanvas = document.getElementById('curveCanvas');
        const curveCtx = curveCanvas.getContext('2d');
        const strafeCanvas = document.getElementById('strafeCanvas');
        const strafeCtx = strafeCanvas.getContext('2d');
        const diagonalCanvas = document.getElementById('diagonalCanvas');
        const diagonalCtx = diagonalCanvas.getContext('2d');
        const aimAssistCanvas = document.getElementById('aimAssistCanvas');
        const aimAssistCtx = aimAssistCanvas.getContext('2d');
        const turningExtraCanvas = document.getElementById('turningExtraCanvas');
        const turningExtraCtx = turningExtraCanvas.getContext('2d');
        const speedComparisonCanvas = document.getElementById('speedComparisonCanvas');
        const speedComparisonCtx = speedComparisonCanvas.getContext('2d');

        // State
        let aaViewMode = 'hipfire';

        // Presets
        const presets = {
            default: {
                deadzone: 15,
                outerThreshold: 2,
                responseCurve: 10,
                yawSpeed: 160,
                pitchSpeed: 120,
                extraYaw: 220,
                extraPitch: 0,
                rampTime: 33,
                rampDelay: 0,
                adsYawSpeed: 110,
                adsPitchSpeed: 75,
                adsExtraYaw: 30,
                adsExtraPitch: 30,
                adsRampTime: 100,
                adsRampDelay: 25
            },
            linear: {
                deadzone: 0,
                outerThreshold: 2,
                responseCurve: 0,
                yawSpeed: 200,
                pitchSpeed: 180,
                extraYaw: 100,
                extraPitch: 0,
                rampTime: 33,
                rampDelay: 0,
                adsYawSpeed: 140,
                adsPitchSpeed: 120,
                adsExtraYaw: 30,
                adsExtraPitch: 30,
                adsRampTime: 33,
                adsRampDelay: 0
            },
            genburten: {
                deadzone: 2,
                outerThreshold: 1,
                responseCurve: 10,
                yawSpeed: 380,
                pitchSpeed: 350,
                extraYaw: 120,
                extraPitch: 100,
                rampTime: 10,
                rampDelay: 0,
                adsYawSpeed: 200,
                adsPitchSpeed: 180,
                adsExtraYaw: 60,
                adsExtraPitch: 50,
                adsRampTime: 10,
                adsRampDelay: 0
            },
            verhulst: {
                deadzone: 3,
                outerThreshold: 2,
                responseCurve: 8,
                yawSpeed: 320,
                pitchSpeed: 280,
                extraYaw: 80,
                extraPitch: 60,
                rampTime: 15,
                rampDelay: 5,
                adsYawSpeed: 180,
                adsPitchSpeed: 160,
                adsExtraYaw: 40,
                adsExtraPitch: 30,
                adsRampTime: 15,
                adsRampDelay: 5
            },
            snipedown: {
                deadzone: 5,
                outerThreshold: 3,
                responseCurve: 12,
                yawSpeed: 280,
                pitchSpeed: 250,
                extraYaw: 50,
                extraPitch: 40,
                rampTime: 20,
                rampDelay: 10,
                adsYawSpeed: 160,
                adsPitchSpeed: 140,
                adsExtraYaw: 25,
                adsExtraPitch: 20,
                adsRampTime: 20,
                adsRampDelay: 10
            }
        };

        // Calculate diagonal uniformity
        function calculateUniformity(yaw, pitch) {
            const min = Math.min(yaw, pitch);
            const max = Math.max(yaw, pitch);
            return max > 0 ? (min / max * 100) : 100;
        }

        // Calculate AA dependency for hip fire
        function calculateHipAADependency(speed) {
            // Hip fire: 180+ = 0%, 90 = 100%
            if (speed >= 180) return 0;
            if (speed <= 90) return 100;
            return ((180 - speed) / 90) * 100;
        }

        // Calculate AA dependency for ADS
        function calculateAdsAADependency(speed) {
            // ADS: 100+ = 0%, 45 = 100%
            if (speed >= 100) return 0;
            if (speed <= 45) return 100;
            return ((100 - speed) / 55) * 100;
        }

        // Draw AA meters with separate values
        function drawAAMeters() {
            const hipSpeed = parseInt(elements.yawSpeed.value);
            const adsSpeed = parseInt(elements.adsYawSpeed.value);
            
            // Calculate separate dependencies
            const hipDependency = calculateHipAADependency(hipSpeed);
            const adsDependency = calculateAdsAADependency(adsSpeed);
            
            // Retention is same as dependency (lower speeds = higher retention)
            const hipRetention = hipDependency;
            const adsRetention = adsDependency;
            
            // Update hip fire meters
            document.getElementById('hipDependencyBar').style.width = hipDependency + '%';
            document.getElementById('hipDependencyLabel').textContent = Math.round(hipDependency) + '%';
            document.getElementById('hipRetentionBar').style.width = hipRetention + '%';
            document.getElementById('hipRetentionLabel').textContent = Math.round(hipRetention) + '%';
            
            // Update ADS meters
            document.getElementById('adsDependencyBar').style.width = adsDependency + '%';
            document.getElementById('adsDependencyLabel').textContent = Math.round(adsDependency) + '%';
            document.getElementById('adsRetentionBar').style.width = adsRetention + '%';
            document.getElementById('adsRetentionLabel').textContent = Math.round(adsRetention) + '%';
            
            // Update speed labels in the meter titles
            document.getElementById('hipAALabel').textContent = `Hip Fire (${hipSpeed}°/s)`;
            document.getElementById('adsAALabel').textContent = `ADS (${adsSpeed}°/s)`;
            
            // Determine profile type
            let profileType = "";
            let profileDescription = "";
            
            if (hipDependency >= 75 && adsDependency >= 75) {
                profileType = "AA Dependent";
                profileDescription = "You heavily rely on aim assist for both hip fire and ADS tracking. Your settings provide very sticky AA but limited independent tracking capability. This is great for consistency but may struggle with fast target switches or when AA is unavailable.";
            } else if (hipDependency >= 75 && adsDependency < 25) {
                profileType = "Sniper Style";
                profileDescription = "You rely on AA for close range hip fire but have independent tracking when scoped. This profile excels at range with precise ADS control while maintaining sticky AA for emergency close range fights.";
            } else if (hipDependency < 25 && adsDependency >= 75) {
                profileType = "SMG Rusher";
                profileDescription = "You have fast, independent hip fire for aggressive close range play but rely on AA for ADS precision. Perfect for players who prioritize movement and close range dominance while using AA for mid-range beams.";
            } else if (hipDependency < 25 && adsDependency < 25) {
                profileType = "AA Independent";
                profileDescription = "You've achieved true aim independence with minimal AA reliance. This provides maximum flexibility and control but requires excellent stick control. You can freely track targets without AA limitations.";
            } else if (hipDependency >= 50 || adsDependency >= 50) {
                profileType = "Balanced";
                profileDescription = "You have moderate AA dependency with a good balance between assistance and independent control. This versatile setup works well across all ranges while maintaining some AA benefits.";
            } else {
                profileType = "Semi-Independent";
                profileDescription = "You have low AA dependency with mostly independent tracking. AA provides minor assistance but you're not reliant on it. Good for players transitioning to higher skill ceilings.";
            }
            
            document.getElementById('aaProfileType').textContent = profileType;
            document.getElementById('aaProfileDescription').textContent = profileDescription;
            
            // Update meter descriptions based on values
            if (hipDependency > 75) {
                document.getElementById('hipDependencyDesc').textContent = "Heavy reliance - tracking difficult without AA";
            } else if (hipDependency > 50) {
                document.getElementById('hipDependencyDesc').textContent = "Moderate reliance - benefits from AA assistance";
            } else if (hipDependency > 25) {
                document.getElementById('hipDependencyDesc').textContent = "Low reliance - can track without AA";
            } else {
                document.getElementById('hipDependencyDesc').textContent = "AA independent - full tracking control";
            }
            
            if (hipRetention > 75) {
                document.getElementById('hipRetentionDesc').textContent = "Very sticky - hard to break AA bubble";
            } else if (hipRetention > 50) {
                document.getElementById('hipRetentionDesc').textContent = "Moderately sticky - balanced control";
            } else if (hipRetention > 25) {
                document.getElementById('hipRetentionDesc').textContent = "Low stickiness - easy target switching";
            } else {
                document.getElementById('hipRetentionDesc').textContent = "Minimal stickiness - free movement";
            }
            
            // Similar for ADS
            if (adsDependency > 75) {
                document.getElementById('adsDependencyDesc').textContent = "Heavy reliance - tracking difficult without AA";
            } else if (adsDependency > 50) {
                document.getElementById('adsDependencyDesc').textContent = "Moderate reliance - benefits from AA assistance";
            } else if (adsDependency > 25) {
                document.getElementById('adsDependencyDesc').textContent = "Low reliance - can track without AA";
            } else {
                document.getElementById('adsDependencyDesc').textContent = "AA independent - full tracking control";
            }
            
            if (adsRetention > 75) {
                document.getElementById('adsRetentionDesc').textContent = "Very sticky - hard to break AA bubble";
            } else if (adsRetention > 50) {
                document.getElementById('adsRetentionDesc').textContent = "Moderately sticky - balanced control";
            } else if (adsRetention > 25) {
                document.getElementById('adsRetentionDesc').textContent = "Low stickiness - easy target switching";
            } else {
                document.getElementById('adsRetentionDesc').textContent = "Minimal stickiness - free movement";
            }
        }

        // Tab switching
        function switchTab(tab) {
            document.querySelectorAll('.tab-button').forEach(btn => btn.classList.remove('active'));
            document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
            
            if (tab === 'hipfire') {
                document.querySelector('.tab-button:first-child').classList.add('active');
                document.getElementById('hipfire-tab').classList.add('active');
            } else {
                document.querySelector('.tab-button:last-child').classList.add('active');
                document.getElementById('ads-tab').classList.add('active');
            }
        }

        // Visualization tab switching
        function switchVizTab(tab) {
            document.querySelectorAll('.viz-tab').forEach(btn => btn.classList.remove('active'));
            document.querySelectorAll('.viz-content').forEach(content => content.classList.remove('active'));
            
            document.querySelector(`.viz-tab:nth-child(${['core', 'movement', 'aimassist', 'metrics'].indexOf(tab) + 1})`).classList.add('active');
            document.getElementById(`${tab}-viz`).classList.add('active');
            
            // Trigger redraws for canvases in the newly visible tab
            updateVisualizations();
        }

        // Set AA view mode
        function setAAMode(mode) {
            aaViewMode = mode;
            document.querySelectorAll('.aa-mode-toggle button').forEach(btn => btn.classList.remove('active'));
            event.target.classList.add('active');
            
            const infoContent = document.getElementById('aaInfoContent');
            if (mode === 'hipfire') {
                infoContent.innerHTML = `
                    <p>• <strong>Hip Fire Range:</strong> 3m to 33m (No AA under 3m or over 33m)</p>
                    <p>• <strong>AA Strength:</strong> 30% relative position maintenance within AA bubble</p>
                    <p>• <strong>Bubble Size:</strong> Scales with enemy distance (smaller at range)</p>
                    <p>• <strong>No Direct Assistance:</strong> No recoil control or bullet drop compensation</p>
                    <p>• Lower response curves provide smoother tracking within AA bubble</p>
                `;
            } else {
                infoContent.innerHTML = `
                    <p>• <strong>ADS Range:</strong> No technical limit (practical limit based on bubble size)</p>
                    <p>• <strong>AA Strength:</strong> 30% relative position maintenance within AA bubble</p>
                    <p>• <strong>Bubble Scaling:</strong> Decreases with distance, increases with optic magnification</p>
                    <p>• <strong>Magnification Effect:</strong> Higher zoom = larger on-screen bubble = more effective AA</p>
                    <p>• <strong>Limitations:</strong> No recoil control, no bullet drop/velocity compensation</p>
                `;
            }
            
            drawAimAssist();
        }

        // Get curve type name
        function getCurveTypeName(value) {
            if (value == 0) return "Linear";
            if (value <= 5) return "Mild Curve";
            if (value <= 9) return "Moderate Curve";
            if (value == 10) return "Classic";
            if (value <= 15) return "S-Curve";
            if (value <= 20) return "Strong Curve";
            return "Heavy Acceleration";
        }

        // Update warnings
        function updateWarnings() {
            // Hip fire warnings - check raw values against 90
            const hipYaw = parseInt(elements.yawSpeed.value);
            const hipPitch = parseInt(elements.pitchSpeed.value);
            const hipYawWarning = document.getElementById('hipYawWarning');
            const hipPitchWarning = document.getElementById('hipPitchWarning');
            
            hipYawWarning.innerHTML = '';
            hipPitchWarning.innerHTML = '';
            
            // Hip Yaw warning
            if (hipYaw < 90) {
                hipYawWarning.innerHTML = '<div class="warning warning-red">⚠️ Below 90°/s - Cannot track close range strafes at 3m</div>';
            } else if (hipYaw < 130) {
                hipYawWarning.innerHTML = '<div class="warning warning-yellow">⚡ Minimum viable - limited strafe tracking</div>';
            } else {
                hipYawWarning.innerHTML = '<div class="warning warning-green">✓ Good for close range tracking</div>';
            }
            
            // Hip Pitch warning
            if (hipPitch < 90) {
                hipPitchWarning.innerHTML = '<div class="warning warning-red">⚠️ Below 90°/s - Cannot track close range vertical movement</div>';
            } else if (hipPitch < 130) {
                hipPitchWarning.innerHTML = '<div class="warning warning-yellow">⚡ Minimum viable - limited vertical tracking</div>';
            } else {
                hipPitchWarning.innerHTML = '<div class="warning warning-green">✓ Good vertical tracking</div>';
            }
            
            // ADS warnings - check raw values against 45
            const adsYaw = parseInt(elements.adsYawSpeed.value);
            const adsPitch = parseInt(elements.adsPitchSpeed.value);
            const adsYawWarning = document.getElementById('adsYawWarning');
            const adsPitchWarning = document.getElementById('adsPitchWarning');
            
            adsYawWarning.innerHTML = '';
            adsPitchWarning.innerHTML = '';
            
            // ADS Yaw warning
            if (adsYaw < 45) {
                adsYawWarning.innerHTML = '<div class="warning warning-red">⚠️ Below 45°/s - Cannot track basic movement</div>';
            } else if (adsYaw < 75) {
                adsYawWarning.innerHTML = '<div class="warning warning-yellow">⚡ Minimum viable for tracking</div>';
            } else {
                adsYawWarning.innerHTML = '<div class="warning warning-green">✓ Good tracking potential</div>';
            }
            
            // ADS Pitch warning
            if (adsPitch < 45) {
                adsPitchWarning.innerHTML = '<div class="warning warning-red">⚠️ Below 45°/s - Cannot track basic movement</div>';
            } else if (adsPitch < 75) {
                adsPitchWarning.innerHTML = '<div class="warning warning-yellow">⚡ Minimum viable for tracking</div>';
            } else {
                adsPitchWarning.innerHTML = '<div class="warning warning-green">✓ Good tracking potential</div>';
            }
            
            // Outer threshold warning
            const outerWarning = document.getElementById('outerThresholdWarning');
            outerWarning.innerHTML = '';
            
            if (elements.outerThreshold.value < 2) {
                outerWarning.innerHTML = '<div class="warning warning-red">⚠️ ALPS controllers (standard Xbox/PS) need minimum 2% to avoid edge detection issues</div>';
            }

            // Ramp-up time warnings based on turning extra values
            const hipExtra = Math.max(parseInt(elements.extraYaw.value), parseInt(elements.extraPitch.value));
            const hipRamp = parseInt(elements.rampTime.value);
            const hipRampWarning = document.getElementById('hipRampWarning');
            
            hipRampWarning.innerHTML = '';
            
            if (hipExtra < 50) {
                hipRampWarning.innerHTML = '<div class="warning warning-green">✓ Ramp-up has minimal impact with low turning extra</div>';
            } else if (hipExtra < 150) {
                if (hipRamp > 50) {
                    hipRampWarning.innerHTML = '<div class="warning warning-yellow">⚡ Ramp-up may feel sluggish for moderate turning extra</div>';
                } else if (hipRamp < 20) {
                    hipRampWarning.innerHTML = '<div class="warning warning-yellow">⚡ Ramp-up may be too fast, consider 25-40%</div>';
                } else {
                    hipRampWarning.innerHTML = '<div class="warning warning-green">✓ Good ramp-up for moderate turning extra</div>';
                }
            } else {
                // High turning extra (150+)
                if (hipRamp < 20) {
                    hipRampWarning.innerHTML = '<div class="warning warning-red">⚠️ Too fast! Will cause jerky turns with high turning extra</div>';
                } else if (hipRamp > 40) {
                    hipRampWarning.innerHTML = '<div class="warning warning-yellow">⚡ May feel delayed, consider 25-35% for high turning extra</div>';
                } else {
                    hipRampWarning.innerHTML = '<div class="warning warning-green">✓ Optimal for high acceleration (25-35%)</div>';
                }
            }

            // ADS ramp warnings
            const adsExtra = Math.max(parseInt(elements.adsExtraYaw.value), parseInt(elements.adsExtraPitch.value));
            const adsRamp = parseInt(elements.adsRampTime.value);
            const adsRampWarning = document.getElementById('adsRampWarning');
            
            adsRampWarning.innerHTML = '';
            
            if (adsExtra < 50) {
                adsRampWarning.innerHTML = '<div class="warning warning-green">✓ Ramp-up has minimal impact with low turning extra</div>';
            } else if (adsExtra < 150) {
                if (adsRamp > 50) {
                    adsRampWarning.innerHTML = '<div class="warning warning-yellow">⚡ Ramp-up may feel sluggish for moderate turning extra</div>';
                } else {
                    adsRampWarning.innerHTML = '<div class="warning warning-green">✓ Good ramp-up for moderate turning extra</div>';
                }
            } else {
                if (adsRamp < 20) {
                    adsRampWarning.innerHTML = '<div class="warning warning-red">⚠️ Too fast for ADS precision!</div>';
                } else {
                    adsRampWarning.innerHTML = '<div class="warning warning-green">✓ Good ADS ramp-up</div>';
                }
            }
        }

        // Update diagonal uniformity visualization
        function updateDiagonalUniformity() {
            const hipYaw = parseInt(elements.yawSpeed.value);
            const hipPitch = parseInt(elements.pitchSpeed.value);
            const adsYaw = parseInt(elements.adsYawSpeed.value);
            const adsPitch = parseInt(elements.adsPitchSpeed.value);
            
            const hipUniformity = calculateUniformity(hipYaw, hipPitch);
            const adsUniformity = calculateUniformity(adsYaw, adsPitch);
            
            // Update bars
            document.getElementById('hipUniformityBar').style.width = hipUniformity + '%';
            document.getElementById('hipUniformityLabel').textContent = Math.round(hipUniformity) + '%';
            document.getElementById('adsUniformityBar').style.width = adsUniformity + '%';
            document.getElementById('adsUniformityLabel').textContent = Math.round(adsUniformity) + '%';
            
            // Update diagonal analysis box
            const worstUniformity = Math.min(hipUniformity, adsUniformity);
            const statusEl = document.getElementById('uniformityStatus');
            const textEl = document.getElementById('uniformityText');
            
            if (worstUniformity >= 80) {
                statusEl.className = 'uniformity-status uniformity-good';
                statusEl.textContent = '✓ Excellent Diagonal Uniformity';
                textEl.textContent = 'Your diagonal movement will feel consistent and predictable. Pro-level settings!';
            } else if (worstUniformity >= 60) {
                statusEl.className = 'uniformity-status uniformity-warning';
                statusEl.textContent = '⚡ Acceptable Diagonal Uniformity';
                textEl.textContent = 'Some diagonal inconsistency. Consider matching yaw/pitch closer for better feel.';
            } else {
                statusEl.className = 'uniformity-status uniformity-bad';
                statusEl.textContent = '⚠️ Poor Diagonal Uniformity';
                textEl.textContent = 'Diagonal tracking will feel very inconsistent! Match yaw and pitch speeds.';
            }
        }

        // Draw diagonal uniformity visualization
        function drawDiagonalVisualization() {
            const width = diagonalCanvas.width;
            const height = diagonalCanvas.height;
            const centerX = width / 2;
            const centerY = height / 2;
            const maxRadius = Math.min(centerX, centerY) - 40;
            
            // Clear canvas
            diagonalCtx.clearRect(0, 0, width, height);
            
            // Draw background
            diagonalCtx.fillStyle = '#0a0a0a';
            diagonalCtx.fillRect(0, 0, width, height);
            
            // Draw grid
            diagonalCtx.strokeStyle = '#333';
            diagonalCtx.lineWidth = 1;
            
            // Draw crosshairs
            diagonalCtx.beginPath();
            diagonalCtx.moveTo(centerX - maxRadius, centerY);
            diagonalCtx.lineTo(centerX + maxRadius, centerY);
            diagonalCtx.moveTo(centerX, centerY - maxRadius);
            diagonalCtx.lineTo(centerX, centerY + maxRadius);
            diagonalCtx.stroke();
            
            // Draw diagonal lines
            diagonalCtx.strokeStyle = '#444';
            diagonalCtx.setLineDash([5, 5]);
            diagonalCtx.beginPath();
            const diag = maxRadius * 0.707;
            diagonalCtx.moveTo(centerX - diag, centerY - diag);
            diagonalCtx.lineTo(centerX + diag, centerY + diag);
            diagonalCtx.moveTo(centerX - diag, centerY + diag);
            diagonalCtx.lineTo(centerX + diag, centerY - diag);
            diagonalCtx.stroke();
            diagonalCtx.setLineDash([]);
            
            // Draw perfect circle reference
            diagonalCtx.strokeStyle = '#666';
            diagonalCtx.lineWidth = 2;
            diagonalCtx.beginPath();
            diagonalCtx.arc(centerX, centerY, maxRadius * 0.7, 0, Math.PI * 2);
            diagonalCtx.stroke();
            
            // Get current speeds
            const hipYaw = parseInt(elements.yawSpeed.value);
            const hipPitch = parseInt(elements.pitchSpeed.value);
            const adsYaw = parseInt(elements.adsYawSpeed.value);
            const adsPitch = parseInt(elements.adsPitchSpeed.value);
            
            // Draw hip fire oval
            diagonalCtx.save();
            diagonalCtx.translate(centerX - centerX/2, centerY);
            const hipScaleX = 1;
            const hipScaleY = hipPitch / hipYaw;
            diagonalCtx.scale(hipScaleX, hipScaleY);
            diagonalCtx.strokeStyle = '#ff4444';
            diagonalCtx.lineWidth = 3 / Math.max(hipScaleX, hipScaleY);
            diagonalCtx.beginPath();
            diagonalCtx.arc(0, 0, maxRadius * 0.5, 0, Math.PI * 2);
            diagonalCtx.stroke();
            diagonalCtx.restore();
            
            // Draw ADS oval
            diagonalCtx.save();
            diagonalCtx.translate(centerX + centerX/2, centerY);
            const adsScaleX = 1;
            const adsScaleY = adsPitch / adsYaw;
            diagonalCtx.scale(adsScaleX, adsScaleY);
            diagonalCtx.strokeStyle = '#44ff44';
            diagonalCtx.lineWidth = 3 / Math.max(adsScaleX, adsScaleY);
            diagonalCtx.beginPath();
            diagonalCtx.arc(0, 0, maxRadius * 0.5, 0, Math.PI * 2);
            diagonalCtx.stroke();
            diagonalCtx.restore();
            
            // Labels
            diagonalCtx.fillStyle = '#aaa';
            diagonalCtx.font = '12px Arial';
            diagonalCtx.textAlign = 'center';
            diagonalCtx.fillText('Hip Fire', centerX - centerX/2, height - 20);
            diagonalCtx.fillText('ADS', centerX + centerX/2, height - 20);
            
            // Legend
            diagonalCtx.fillStyle = '#666';
            diagonalCtx.fillText('Gray = Perfect Circle', centerX, 20);
            diagonalCtx.fillStyle = '#ff4444';
            diagonalCtx.fillText('Red = Hip Movement', centerX - 100, 35);
            diagonalCtx.fillStyle = '#44ff44';
            diagonalCtx.fillText('Green = ADS Movement', centerX + 100, 35);
        }

        // Draw aim assist visualization
        function drawAimAssist() {
            const width = aimAssistCanvas.width;
            const height = aimAssistCanvas.height;
            const padding = 40;
            const graphWidth = width - 2 * padding;
            const graphHeight = height - 2 * padding;
            
            // Clear canvas
            aimAssistCtx.clearRect(0, 0, width, height);
            
            // Draw background
            aimAssistCtx.fillStyle = '#0a0a0a';
            aimAssistCtx.fillRect(0, 0, width, height);
            
            // Draw grid
            aimAssistCtx.strokeStyle = '#333';
            aimAssistCtx.lineWidth = 1;
            
            if (aaViewMode === 'hipfire') {
                // Hip fire view: 0-40m range
                const distances = [0, 3, 10, 20, 33, 40];
                distances.forEach((dist) => {
                    const x = padding + (dist / 40) * graphWidth;
                    aimAssistCtx.beginPath();
                    aimAssistCtx.moveTo(x, padding);
                    aimAssistCtx.lineTo(x, height - padding);
                    aimAssistCtx.stroke();
                    
                    // Label
                    aimAssistCtx.fillStyle = '#666';
                    aimAssistCtx.font = '10px Arial';
                    aimAssistCtx.textAlign = 'center';
                    aimAssistCtx.fillText(dist + 'm', x, height - padding + 15);
                });
                
                // Draw no-AA zones
                aimAssistCtx.fillStyle = '#ff000022';
                // Under 3m
                aimAssistCtx.fillRect(padding, padding, (3/40) * graphWidth, graphHeight);
                // Over 33m
                aimAssistCtx.fillRect(padding + (33/40) * graphWidth, padding, (7/40) * graphWidth, graphHeight);
                
                // Draw AA active zone
                aimAssistCtx.fillStyle = '#00ff0033';
                aimAssistCtx.fillRect(padding + (3/40) * graphWidth, padding, (30/40) * graphWidth, graphHeight);
                
                // Draw AA strength curve
                aimAssistCtx.strokeStyle = '#00ff00';
                aimAssistCtx.lineWidth = 3;
                aimAssistCtx.beginPath();
                
                for (let i = 0; i <= 40; i++) {
                    const distance = i;
                    let aaStrength = 0;
                    
                    if (distance >= 3 && distance <= 33) {
                        aaStrength = 0.3; // Constant 30% within range
                    }
                    
                    const x = padding + (distance / 40) * graphWidth;
                    const y = height - padding - (aaStrength / 0.3 * graphHeight * 0.8);
                    
                    if (i === 0) {
                        aimAssistCtx.moveTo(x, y);
                    } else {
                        aimAssistCtx.lineTo(x, y);
                    }
                }
                
                aimAssistCtx.stroke();
                
                // Draw bubble size curve
                aimAssistCtx.strokeStyle = '#ffff00';
                aimAssistCtx.lineWidth = 2;
                aimAssistCtx.beginPath();
                
                for (let i = 0; i <= 40; i++) {
                    const distance = i;
                    let bubbleSize = 0;
                    
                    if (distance >= 3 && distance <= 33) {
                        // Bubble size decreases with distance
                        bubbleSize = 1 - (distance - 3) / 30 * 0.7; // From 100% at 3m to 30% at 33m
                    }
                    
                    const x = padding + (distance / 40) * graphWidth;
                    const y = height - padding - (bubbleSize * graphHeight * 0.8);
                    
                    if (i === 0) {
                        aimAssistCtx.moveTo(x, y);
                    } else {
                        aimAssistCtx.lineTo(x, y);
                    }
                }
                
                aimAssistCtx.stroke();
                
            } else {
                // ADS view: 0-100m range with practical limits
                const distances = [0, 10, 25, 50, 75, 100];
                distances.forEach((dist) => {
                    const x = padding + (dist / 100) * graphWidth;
                    aimAssistCtx.beginPath();
                    aimAssistCtx.moveTo(x, padding);
                    aimAssistCtx.lineTo(x, height - padding);
                    aimAssistCtx.stroke();
                    
                    // Label
                    aimAssistCtx.fillStyle = '#666';
                    aimAssistCtx.font = '10px Arial';
                    aimAssistCtx.textAlign = 'center';
                    aimAssistCtx.fillText(dist + 'm', x, height - padding + 15);
                });
                
                // Draw AA strength (constant 30%)
                aimAssistCtx.strokeStyle = '#00ff00';
                aimAssistCtx.lineWidth = 3;
                aimAssistCtx.beginPath();
                aimAssistCtx.moveTo(padding, height - padding - 0.3 * graphHeight * 0.8);
                aimAssistCtx.lineTo(width - padding, height - padding - 0.3 * graphHeight * 0.8);
                aimAssistCtx.stroke();
                
                // Draw bubble size curve (practical limit)
                aimAssistCtx.strokeStyle = '#ffff00';
                aimAssistCtx.lineWidth = 2;
                aimAssistCtx.beginPath();
                
                for (let i = 0; i <= 100; i++) {
                    const distance = i;
                    // Bubble size decreases exponentially with distance
                    const bubbleSize = Math.exp(-distance / 30); // Exponential decay
                    
                    const x = padding + (distance / 100) * graphWidth;
                    const y = height - padding - (bubbleSize * graphHeight * 0.8);
                    
                    if (i === 0) {
                        aimAssistCtx.moveTo(x, y);
                    } else {
                        aimAssistCtx.lineTo(x, y);
                    }
                }
                
                aimAssistCtx.stroke();
                
                // Draw practical limit zone
                aimAssistCtx.fillStyle = '#ff000011';
                aimAssistCtx.fillRect(padding + (50/100) * graphWidth, padding, (50/100) * graphWidth, graphHeight);
                
                // Label practical limit
                aimAssistCtx.fillStyle = '#ff4444';
                aimAssistCtx.font = '12px Arial';
                aimAssistCtx.textAlign = 'center';
                aimAssistCtx.fillText('Practical Limit', padding + (75/100) * graphWidth, padding + 20);
            }
            
            // Draw axes
            aimAssistCtx.strokeStyle = '#666';
            aimAssistCtx.lineWidth = 2;
            aimAssistCtx.beginPath();
            aimAssistCtx.moveTo(padding, height - padding);
            aimAssistCtx.lineTo(width - padding, height - padding);
            aimAssistCtx.moveTo(padding, padding);
            aimAssistCtx.lineTo(padding, height - padding);
            aimAssistCtx.stroke();
            
            // Labels
            aimAssistCtx.fillStyle = '#aaa';
            aimAssistCtx.font = '12px Arial';
            aimAssistCtx.textAlign = 'center';
            aimAssistCtx.fillText('Distance (meters)', width / 2, height - 5);
            
            // Legend
            aimAssistCtx.font = '11px Arial';
            aimAssistCtx.textAlign = 'left';
            
            aimAssistCtx.fillStyle = '#00ff00';
            aimAssistCtx.fillText('AA Strength (30%)', width - 130, 20);
            
            aimAssistCtx.fillStyle = '#ffff00';
            aimAssistCtx.fillText('Bubble Size', width - 130, 35);
        }

        // Draw turning extra visualization
        function drawTurningExtra() {
            const width = turningExtraCanvas.width;
            const height = turningExtraCanvas.height;
            const padding = 40;
            const graphWidth = width - 2 * padding;
            const graphHeight = height - 2 * padding;
            
            // Clear canvas
            turningExtraCtx.clearRect(0, 0, width, height);
            
            // Draw background
            turningExtraCtx.fillStyle = '#0a0a0a';
            turningExtraCtx.fillRect(0, 0, width, height);
            
            // Draw AA range zones
            turningExtraCtx.fillStyle = '#00ff0022';
            turningExtraCtx.fillRect(padding + (3/40) * graphWidth, padding, (30/40) * graphWidth, graphHeight);
            
            // Draw no-AA zones where turning extra works
            turningExtraCtx.fillStyle = '#ff440022';
            turningExtraCtx.fillRect(padding, padding, (3/40) * graphWidth, graphHeight);
            turningExtraCtx.fillRect(padding + (33/40) * graphWidth, padding, (7/40) * graphWidth, graphHeight);
            
            // Draw stick deflection requirement
            const stickThreshold = padding + graphHeight * 0.2; // 80% line (100% required)
            
            turningExtraCtx.strokeStyle = '#ff4444';
            turningExtraCtx.lineWidth = 2;
            turningExtraCtx.setLineDash([5, 5]);
            turningExtraCtx.beginPath();
            turningExtraCtx.moveTo(padding, stickThreshold);
            turningExtraCtx.lineTo(width - padding, stickThreshold);
            turningExtraCtx.stroke();
            turningExtraCtx.setLineDash([]);
            
            // Labels
            turningExtraCtx.fillStyle = '#ff4444';
            turningExtraCtx.font = '11px Arial';
            turningExtraCtx.textAlign = 'left';
            turningExtraCtx.fillText('100% Stick Required', padding + 5, stickThreshold - 5);
            
            // Draw distance markers
            turningExtraCtx.strokeStyle = '#333';
            turningExtraCtx.lineWidth = 1;
            
            const distances = [0, 3, 10, 20, 33, 40];
            distances.forEach(dist => {
                const x = padding + (dist / 40) * graphWidth;
                turningExtraCtx.beginPath();
                turningExtraCtx.moveTo(x, padding);
                turningExtraCtx.lineTo(x, height - padding);
                turningExtraCtx.stroke();
                
                turningExtraCtx.fillStyle = '#666';
                turningExtraCtx.font = '10px Arial';
                turningExtraCtx.textAlign = 'center';
                turningExtraCtx.fillText(dist + 'm', x, height - padding + 15);
            });
            
            // Zone labels
            turningExtraCtx.fillStyle = '#00ff00';
            turningExtraCtx.font = '12px Arial';
            turningExtraCtx.textAlign = 'center';
            turningExtraCtx.fillText('AA Active (No Extra)', padding + (18/40) * graphWidth, padding + graphHeight/2);
            
            turningExtraCtx.fillStyle = '#ff4444';
            turningExtraCtx.fillText('Extra Active', padding + (1.5/40) * graphWidth, padding + graphHeight/2);
            turningExtraCtx.fillText('Extra Active', padding + (36.5/40) * graphWidth, padding + graphHeight/2);
            
            // Title
            turningExtraCtx.fillStyle = '#aaa';
            turningExtraCtx.font = '12px Arial';
            turningExtraCtx.textAlign = 'center';
            turningExtraCtx.fillText('Distance (Hip Fire)', width / 2, height - 5);
        }

        // Draw speed comparison - FIXED TO USE RAW VALUES
        function drawSpeedComparison() {
            const width = speedComparisonCanvas.width;
            const height = speedComparisonCanvas.height;
            const padding = 40;
            const graphWidth = width - 2 * padding;
            const graphHeight = height - 2 * padding;
            
            // Clear canvas
            speedComparisonCtx.clearRect(0, 0, width, height);
            
            // Draw background
            speedComparisonCtx.fillStyle = '#0a0a0a';
            speedComparisonCtx.fillRect(0, 0, width, height);
            
            // Get RAW speed values (already in degrees per second)
            const hipBase = parseInt(elements.yawSpeed.value);
            const hipMax = parseInt(elements.yawSpeed.value) + parseInt(elements.extraYaw.value);
            const adsBase = parseInt(elements.adsYawSpeed.value);
            const adsMax = parseInt(elements.adsYawSpeed.value) + parseInt(elements.adsExtraYaw.value);
            
            const maxSpeed = Math.max(hipBase, hipMax, adsBase, adsMax);
            const scale = graphHeight / (maxSpeed * 1.1);
            
            // Draw grid
            speedComparisonCtx.strokeStyle = '#333';
            speedComparisonCtx.lineWidth = 1;
            
            // Horizontal lines
            for (let i = 0; i <= 5; i++) {
                const y = padding + (i / 5) * graphHeight;
                speedComparisonCtx.beginPath();
                speedComparisonCtx.moveTo(padding, y);
                speedComparisonCtx.lineTo(width - padding, y);
                speedComparisonCtx.stroke();
                
                // Label - show raw speed values
                const speed = Math.round((1 - i / 5) * maxSpeed * 1.1);
                speedComparisonCtx.fillStyle = '#666';
                speedComparisonCtx.font = '10px Arial';
                speedComparisonCtx.textAlign = 'right';
                speedComparisonCtx.fillText(speed + '°/s', padding - 5, y + 3);
            }
            
            // Draw bars
            const barWidth = graphWidth / 8;
            const barSpacing = graphWidth / 4;
            
            const bars = [
                { label: 'Hip Base', value: hipBase, color: '#ff4444', x: padding + barSpacing - barWidth * 1.5 },
                { label: 'Hip Max', value: hipMax, color: '#ff7777', x: padding + barSpacing - barWidth * 0.5 },
                { label: 'ADS Base', value: adsBase, color: '#44ff44', x: padding + barSpacing * 3 - barWidth * 1.5 },
                { label: 'ADS Max', value: adsMax, color: '#77ff77', x: padding + barSpacing * 3 - barWidth * 0.5 }
            ];
            
            bars.forEach(bar => {
                const barHeight = bar.value * scale;
                speedComparisonCtx.fillStyle = bar.color;
                speedComparisonCtx.fillRect(bar.x, height - padding - barHeight, barWidth, barHeight);
                
                // Value label - show raw speed value
                speedComparisonCtx.fillStyle = '#fff';
                speedComparisonCtx.font = '11px Arial';
                speedComparisonCtx.textAlign = 'center';
                speedComparisonCtx.fillText(bar.value + '°/s', bar.x + barWidth / 2, height - padding - barHeight - 5);
                
                // Bar label
                speedComparisonCtx.fillStyle = '#aaa';
                speedComparisonCtx.fillText(bar.label, bar.x + barWidth / 2, height - padding + 15);
            });
            
            // Update speed values in metrics - values are already in degrees per second
            document.getElementById('hipBaseSpeed').textContent = hipBase + '°/s';
            document.getElementById('hipMaxSpeed').textContent = hipMax + '°/s';
            document.getElementById('adsBaseSpeed').textContent = adsBase + '°/s';
            document.getElementById('adsMaxSpeed').textContent = adsMax + '°/s';
        }

        // Update value displays
        function updateValues() {
            valueElements.deadzoneValue.textContent = elements.deadzone.value + '%';
            valueElements.outerThresholdValue.textContent = elements.outerThreshold.value + '%';
            valueElements.responseCurveValue.textContent = elements.responseCurve.value;
            valueElements.yawSpeedValue.textContent = elements.yawSpeed.value;
            valueElements.pitchSpeedValue.textContent = elements.pitchSpeed.value;
            valueElements.extraYawValue.textContent = elements.extraYaw.value;
            valueElements.extraPitchValue.textContent = elements.extraPitch.value;
            valueElements.rampTimeValue.textContent = elements.rampTime.value + '%';
            valueElements.rampDelayValue.textContent = elements.rampDelay.value + '%';
            valueElements.adsYawSpeedValue.textContent = elements.adsYawSpeed.value;
            valueElements.adsPitchSpeedValue.textContent = elements.adsPitchSpeed.value;
            valueElements.adsExtraYawValue.textContent = elements.adsExtraYaw.value;
            valueElements.adsExtraPitchValue.textContent = elements.adsExtraPitch.value;
            valueElements.adsRampTimeValue.textContent = elements.adsRampTime.value + '%';
            valueElements.adsRampDelayValue.textContent = elements.adsRampDelay.value + '%';
            
            // Update curve type indicator
            document.getElementById('curveTypeIndicator').textContent = `(${getCurveTypeName(elements.responseCurve.value)})`;
            
            updateWarnings();
            updateStats();
            updateDiagonalUniformity();
            updateVisualizations();
            updateAnalysis();
        }

        // Calculate 180 turn times - FIXED TO USE RAW VALUES
        function updateStats() {
            const hipYaw = parseInt(elements.yawSpeed.value);
            const hipYawExtra = parseInt(elements.yawSpeed.value) + parseInt(elements.extraYaw.value);
            const adsYaw = parseInt(elements.adsYawSpeed.value);
            const adsYawExtra = parseInt(elements.adsYawSpeed.value) + parseInt(elements.adsExtraYaw.value);
            
            document.getElementById('hip180Time').textContent = (180 / hipYaw).toFixed(2) + 's';
            document.getElementById('hip180TimeExtra').textContent = (180 / hipYawExtra).toFixed(2) + 's';
            document.getElementById('ads180Time').textContent = (180 / adsYaw).toFixed(2) + 's';
            document.getElementById('ads180TimeExtra').textContent = (180 / adsYawExtra).toFixed(2) + 's';
        }

        // Apply deadzone calculations
        function applyDeadzone(x, y, deadzone, outerThreshold) {
            const magnitude = Math.sqrt(x * x + y * y);
            const deadzoneValue = deadzone / 100;
            const outerValue = outerThreshold / 100;
            
            if (magnitude < deadzoneValue) return { x: 0, y: 0, inDeadzone: true };
            
            let adjustedMagnitude = magnitude;
            if (magnitude > 1 - outerValue) {
                adjustedMagnitude = 1 - outerValue;
            }
            
            const scaled = (adjustedMagnitude - deadzoneValue) / (1 - deadzoneValue - outerValue);
            const angle = Math.atan2(y, x);
            
            return {
                x: scaled * Math.cos(angle),
                y: scaled * Math.sin(angle),
                inDeadzone: false,
                inOuter: magnitude > 1 - outerValue
            };
        }

        // Apply response curve
        function applyResponseCurve(input, curveValue) {
            const absInput = Math.abs(input);
            let output;
            
            if (curveValue == 0) {
                // 0 = Perfect Linear
                output = absInput;
            } else if (curveValue <= 5) {
                // 1-5 = Mild exponential curve
                const power = 1 + (curveValue * 0.1);
                output = Math.pow(absInput, power);
            } else if (curveValue <= 9) {
                // 6-9 = Moderate curve approaching classic
                const t = (curveValue - 5) / 4; // Interpolation factor
                const linearOutput = absInput;
                const classicOutput = Math.pow(absInput, 1.5); // Classic curve approximation
                output = linearOutput * (1 - t) + classicOutput * t;
            } else if (curveValue == 10) {
                // 10 = Classic (Default Apex curve)
                output = Math.pow(absInput, 1.5);
            } else if (curveValue <= 20) {
                // 11-20 = S-curve with increasing strength
                const k = (curveValue - 10) / 5;
                output = Math.tanh(k * absInput * 3) / Math.tanh(k * 3);
            } else {
                // 21-30 = Heavy acceleration curve
                const power = 2 + (curveValue - 20) * 0.1;
                output = Math.pow(absInput, power);
            }
            
            return Math.sign(input) * output;
        }

        // Draw deadzone visualization
        function drawDeadzone() {
            const centerX = deadzoneCanvas.width / 2;
            const centerY = deadzoneCanvas.height / 2;
            const maxRadius = Math.min(centerX, centerY) - 20;
            
            // Clear canvas
            deadzoneCtx.clearRect(0, 0, deadzoneCanvas.width, deadzoneCanvas.height);
            
            // Draw background
            deadzoneCtx.fillStyle = '#0a0a0a';
            deadzoneCtx.fillRect(0, 0, deadzoneCanvas.width, deadzoneCanvas.height);
            
            // Draw outer circle
            deadzoneCtx.strokeStyle = '#444';
            deadzoneCtx.lineWidth = 2;
            deadzoneCtx.beginPath();
            deadzoneCtx.arc(centerX, centerY, maxRadius, 0, Math.PI * 2);
            deadzoneCtx.stroke();
            
            // Draw outer threshold zone
            const outerThresholdRadius = maxRadius * (1 - elements.outerThreshold.value / 100);
            deadzoneCtx.fillStyle = '#ffff0033';
            deadzoneCtx.beginPath();
            deadzoneCtx.arc(centerX, centerY, maxRadius, 0, Math.PI * 2);
            deadzoneCtx.arc(centerX, centerY, outerThresholdRadius, 0, Math.PI * 2, true);
            deadzoneCtx.fill();
            
            // Draw active area
            const deadzoneRadius = maxRadius * (elements.deadzone.value / 100);
            deadzoneCtx.fillStyle = '#00ff0033';
            deadzoneCtx.beginPath();
            deadzoneCtx.arc(centerX, centerY, outerThresholdRadius, 0, Math.PI * 2);
            deadzoneCtx.arc(centerX, centerY, deadzoneRadius, 0, Math.PI * 2, true);
            deadzoneCtx.fill();
            
            // Draw deadzone
            deadzoneCtx.fillStyle = '#ff000066';
            deadzoneCtx.beginPath();
            deadzoneCtx.arc(centerX, centerY, deadzoneRadius, 0, Math.PI * 2);
            deadzoneCtx.fill();
            
            // Draw center crosshair
            deadzoneCtx.strokeStyle = '#fff';
            deadzoneCtx.lineWidth = 1;
            deadzoneCtx.beginPath();
            deadzoneCtx.moveTo(centerX - 10, centerY);
            deadzoneCtx.lineTo(centerX + 10, centerY);
            deadzoneCtx.moveTo(centerX, centerY - 10);
            deadzoneCtx.lineTo(centerX, centerY + 10);
            deadzoneCtx.stroke();
            
            // Draw sample stick position
            const stickAngle = Date.now() / 2000;
            const stickRadius = maxRadius * 0.7;
            const stickX = Math.cos(stickAngle) * stickRadius / maxRadius;
            const stickY = Math.sin(stickAngle) * stickRadius / maxRadius;
            
            const processed = applyDeadzone(stickX, stickY, elements.deadzone.value, elements.outerThreshold.value);
            
            // Draw input position
            deadzoneCtx.fillStyle = '#ff4444';
            deadzoneCtx.beginPath();
            deadzoneCtx.arc(centerX + stickX * maxRadius, centerY + stickY * maxRadius, 5, 0, Math.PI * 2);
            deadzoneCtx.fill();
            
            // Draw output position
            if (!processed.inDeadzone) {
                deadzoneCtx.fillStyle = '#00ff00';
                deadzoneCtx.beginPath();
                deadzoneCtx.arc(centerX + processed.x * maxRadius, centerY + processed.y * maxRadius, 5, 0, Math.PI * 2);
                deadzoneCtx.fill();
                
                // Draw line connecting them
                deadzoneCtx.strokeStyle = '#ffff00';
                deadzoneCtx.lineWidth = 1;
                deadzoneCtx.beginPath();
                deadzoneCtx.moveTo(centerX + stickX * maxRadius, centerY + stickY * maxRadius);
                deadzoneCtx.lineTo(centerX + processed.x * maxRadius, centerY + processed.y * maxRadius);
                deadzoneCtx.stroke();
            }
        }

        // Draw response curve
        function drawResponseCurve() {
            const width = curveCanvas.width;
            const height = curveCanvas.height;
            const padding = 30;
            const graphWidth = width - 2 * padding;
            const graphHeight = height - 2 * padding;
            
            // Clear canvas
            curveCtx.clearRect(0, 0, width, height);
            
            // Draw background
            curveCtx.fillStyle = '#0a0a0a';
            curveCtx.fillRect(0, 0, width, height);
            
            // Draw grid
            curveCtx.strokeStyle = '#333';
            curveCtx.lineWidth = 1;
            
            // Vertical lines
            for (let i = 0; i <= 10; i++) {
                const x = padding + (i / 10) * graphWidth;
                curveCtx.beginPath();
                curveCtx.moveTo(x, padding);
                curveCtx.lineTo(x, height - padding);
                curveCtx.stroke();
            }
            
            // Horizontal lines
            for (let i = 0; i <= 10; i++) {
                const y = padding + (i / 10) * graphHeight;
                curveCtx.beginPath();
                curveCtx.moveTo(padding, y);
                curveCtx.lineTo(width - padding, y);
                curveCtx.stroke();
            }
            
            // Draw axes
            curveCtx.strokeStyle = '#666';
            curveCtx.lineWidth = 2;
            curveCtx.beginPath();
            curveCtx.moveTo(padding, height - padding);
            curveCtx.lineTo(width - padding, height - padding);
            curveCtx.moveTo(padding, padding);
            curveCtx.lineTo(padding, height - padding);
            curveCtx.stroke();
            
            // Draw linear reference
            curveCtx.strokeStyle = '#444';
            curveCtx.lineWidth = 1;
            curveCtx.setLineDash([5, 5]);
            curveCtx.beginPath();
            curveCtx.moveTo(padding, height - padding);
            curveCtx.lineTo(width - padding, padding);
            curveCtx.stroke();
            curveCtx.setLineDash([]);
            
            // Draw response curve
            curveCtx.strokeStyle = '#ff4444';
            curveCtx.lineWidth = 3;
            curveCtx.beginPath();
            
            for (let i = 0; i <= 100; i++) {
                const input = i / 100;
                const output = applyResponseCurve(input, elements.responseCurve.value);
                const x = padding + input * graphWidth;
                const y = height - padding - output * graphHeight;
                
                if (i === 0) {
                    curveCtx.moveTo(x, y);
                } else {
                    curveCtx.lineTo(x, y);
                }
            }
            
            curveCtx.stroke();
            
            // Labels
            curveCtx.fillStyle = '#aaa';
            curveCtx.font = '12px Arial';
            curveCtx.textAlign = 'center';
            curveCtx.fillText('Input', width / 2, height - 5);
            curveCtx.save();
            curveCtx.translate(10, height / 2);
            curveCtx.rotate(-Math.PI / 2);
            curveCtx.fillText('Output', 0, 0);
            curveCtx.restore();
        }

        // Draw strafe tracking visualization
        function drawStrafeTracking() {
            const width = strafeCanvas.width;
            const height = strafeCanvas.height;
            const padding = 40;
            const graphWidth = width - 2 * padding;
            const graphHeight = height - 2 * padding;
            
            // Clear canvas
            strafeCtx.clearRect(0, 0, width, height);
            
            // Draw background
            strafeCtx.fillStyle = '#0a0a0a';
            strafeCtx.fillRect(0, 0, width, height);
            
            // Get current speeds
            const hipYaw = parseInt(elements.yawSpeed.value);
            const adsYaw = parseInt(elements.adsYawSpeed.value);
            
            // Draw grid and labels
            strafeCtx.strokeStyle = '#333';
            strafeCtx.lineWidth = 1;
            
            const distances = [3, 10, 20, 30, 50];
            distances.forEach(dist => {
                const x = padding + (dist / 50) * graphWidth;
                strafeCtx.beginPath();
                strafeCtx.moveTo(x, padding);
                strafeCtx.lineTo(x, height - padding);
                strafeCtx.stroke();
                
                strafeCtx.fillStyle = '#666';
                strafeCtx.font = '10px Arial';
                strafeCtx.textAlign = 'center';
                strafeCtx.fillText(dist + 'm', x, height - padding + 15);
            });
            
            // Draw tracking capability zones
            const scenarios = [
                { name: 'Hip Fire', speed: hipYaw, y: padding + graphHeight * 0.3 },
                { name: 'ADS', speed: adsYaw, y: padding + graphHeight * 0.7 }
            ];
            
            scenarios.forEach(scenario => {
                strafeCtx.font = '12px Arial';
                strafeCtx.fillStyle = '#aaa';
                strafeCtx.textAlign = 'left';
                strafeCtx.fillText(scenario.name, padding - 35, scenario.y + 5);
                
                // Draw tracking capability line
                for (let dist = 3; dist <= 50; dist++) {
                    const x = padding + ((dist - 3) / 47) * graphWidth;
                    const nextX = padding + ((dist - 2) / 47) * graphWidth;
                    
                    // Calculate required tracking speed at this distance
                    const baseRequired = scenario.name === 'Hip Fire' ? 90 : 45;
                    const requiredSpeed = baseRequired * (3 / Math.max(3, dist)); // Scales with distance
                    
                    let color;
                    if (scenario.speed >= requiredSpeed * 1.5) {
                        color = '#00ff00'; // Can track easily
                    } else if (scenario.speed >= requiredSpeed) {
                        color = '#ffff00'; // Can track with difficulty
                    } else {
                        color = '#ff0000'; // Cannot track
                    }
                    
                    strafeCtx.strokeStyle = color;
                    strafeCtx.lineWidth = 20;
                    strafeCtx.beginPath();
                    strafeCtx.moveTo(x, scenario.y - 10);
                    strafeCtx.lineTo(nextX, scenario.y - 10);
                    strafeCtx.stroke();
                }
            });
            
            // Draw axes
            strafeCtx.strokeStyle = '#666';
            strafeCtx.lineWidth = 2;
            strafeCtx.beginPath();
            strafeCtx.moveTo(padding, height - padding);
            strafeCtx.lineTo(width - padding, height - padding);
            strafeCtx.stroke();
            
            // Label
            strafeCtx.fillStyle = '#aaa';
            strafeCtx.font = '12px Arial';
            strafeCtx.textAlign = 'center';
            strafeCtx.fillText('Distance (meters)', width / 2, height - 5);
        }

        // Update micro-adjustment visualization
        function updateMicroAdjustment() {
            const deadzone = parseInt(elements.deadzone.value);
            const capability = Math.max(0, 100 - deadzone * 2); // Lower deadzone = higher capability
            
            document.getElementById('microBar').style.width = capability + '%';
            document.getElementById('microLabel').textContent = capability + '%';
            
            let text;
            if (deadzone === 0) {
                text = "Perfect micro-adjustments - maximum precision possible";
            } else if (deadzone < 5) {
                text = "Excellent micro-adjustments - minimal input required";
            } else if (deadzone < 15) {
                text = "Good micro-adjustments - balanced precision";
            } else {
                text = "Limited micro-adjustments - requires larger movements";
            }
            document.getElementById('microText').textContent = text;
        }

        // Update pro comparison
        function updateProComparison() {
            const avgSpeed = (parseInt(elements.yawSpeed.value) + parseInt(elements.pitchSpeed.value)) / 2;
            const proAverage = 300; // Approximate pro average
            const percentage = Math.min(100, (avgSpeed / proAverage) * 100);
            
            document.getElementById('proBar').style.width = percentage + '%';
            document.getElementById('proLabel').textContent = Math.round(percentage) + '%';
        }

        // Update range analysis
        function updateRangeAnalysis() {
            const hipYaw = parseInt(elements.yawSpeed.value);
            const adsYaw = parseInt(elements.adsYawSpeed.value);
            
            // Close range
            if (hipYaw >= 130) {
                document.getElementById('closeRangeStatus').textContent = 'Excellent';
                document.getElementById('closeRangeStatus').style.color = '#00ff00';
            } else if (hipYaw >= 90) {
                document.getElementById('closeRangeStatus').textContent = 'Adequate';
                document.getElementById('closeRangeStatus').style.color = '#ffff00';
            } else {
                document.getElementById('closeRangeStatus').textContent = 'Poor';
                document.getElementById('closeRangeStatus').style.color = '#ff0000';
            }
            
            // Mid range
            if (adsYaw >= 75) {
                document.getElementById('midRangeStatus').textContent = 'Excellent';
                document.getElementById('midRangeStatus').style.color = '#00ff00';
            } else if (adsYaw >= 45) {
                document.getElementById('midRangeStatus').textContent = 'Adequate';
                document.getElementById('midRangeStatus').style.color = '#ffff00';
            } else {
                document.getElementById('midRangeStatus').textContent = 'Poor';
                document.getElementById('midRangeStatus').style.color = '#ff0000';
            }
            
            // Long range
            const curve = parseInt(elements.responseCurve.value);
            if (curve <= 10 && adsYaw >= 45) {
                document.getElementById('longRangeStatus').textContent = 'Excellent';
                document.getElementById('longRangeStatus').style.color = '#00ff00';
            } else if (adsYaw >= 30) {
                document.getElementById('longRangeStatus').textContent = 'Adequate';
                document.getElementById('longRangeStatus').style.color = '#ffff00';
            } else {
                document.getElementById('longRangeStatus').textContent = 'Poor';
                document.getElementById('longRangeStatus').style.color = '#ff0000';
            }
        }

        // Update analysis text
        function updateAnalysis() {
            const deadzone = parseInt(elements.deadzone.value);
            const curve = parseInt(elements.responseCurve.value);
            const hipYaw = parseInt(elements.yawSpeed.value);
            const hipPitch = parseInt(elements.pitchSpeed.value);
            const adsYaw = parseInt(elements.adsYawSpeed.value);
            const extraYaw = parseInt(elements.extraYaw.value);
            
            let analysis = "";
            
            // Deadzone analysis - updated perspective
            if (deadzone === 0) {
                analysis += "• Perfect deadzone: Maximum micro-adjustment capability.\n";
            } else if (deadzone < 5) {
                analysis += "• Excellent deadzone: Great micro-adjustments with minimal input.\n";
            } else if (deadzone < 15) {
                analysis += "• Moderate deadzone: Balanced but could benefit from lowering.\n";
            } else {
                analysis += "• High deadzone: Limiting your micro-adjustment potential significantly.\n";
            }
            
            // Curve analysis
            if (curve == 0) {
                analysis += "• Linear response: Maximum control for recoil and tracking. High skill ceiling.\n";
            } else if (curve <= 5) {
                analysis += "• Mild curve: Good balance between control and forgiveness.\n";
            } else if (curve == 10) {
                analysis += "• Classic curve: Forgiving and familiar, but less precise than linear.\n";
            } else {
                analysis += "• Heavy curve: Very forgiving but sacrifices precision and consistency.\n";
            }
            
            // Speed analysis with specific warnings
            if (hipYaw < 90) {
                analysis += "• ⚠️ CRITICAL: Hip fire too slow for close range! Increase to at least 90°/s.\n";
            } else if (hipYaw < 130) {
                analysis += "• Hip fire speed is minimum viable. Consider increasing for better close range.\n";
            }
            
            if (adsYaw < 45) {
                analysis += "• ⚠️ CRITICAL: ADS too slow for basic tracking! Increase to at least 45°/s.\n";
            } else if (adsYaw < 75) {
                analysis += "• ADS speed is minimum viable. Consider increasing for better tracking.\n";
            }
            
            // Diagonal uniformity analysis
            const hipUniformity = calculateUniformity(hipYaw, hipPitch);
            if (hipUniformity < 70) {
                analysis += "• ⚠️ Poor diagonal uniformity! Match yaw/pitch speeds for consistent aim.\n";
            } else if (hipUniformity < 85) {
                analysis += "• Diagonal movement may feel slightly inconsistent.\n";
            }
            
            // Turning extra advice
            if (extraYaw > 100) {
                analysis += "• High turning extra enables quick 180s while maintaining low base sens.\n";
            } else if (extraYaw === 0) {
                analysis += "• No turning extra: Consider adding some for emergency flicks.\n";
            }
            
            // Overall recommendation
            const avgSpeed = (hipYaw + hipPitch) / 2;
            if (curve === 0 && deadzone < 5 && avgSpeed > 150 && hipUniformity > 85) {
                analysis += "\n🏆 Pro-level setup detected! High skill ceiling configuration.";
            } else if (curve > 15 || deadzone > 20) {
                analysis += "\n⚠️ Settings may be limiting your potential. Consider moving toward linear/low deadzone.";
            }
            
            // Update the element with proper formatting
            const analysisElement = document.getElementById('analysisText');
            analysisElement.innerHTML = analysis.split('\n').map(line => 
                line.trim() ? `<p style="margin: 5px 0;">${line}</p>` : ''
            ).join('');
            
            updateMicroAdjustment();
            updateProComparison();
            updateRangeAnalysis();
        }

        // Animation loop
        function animate() {
            drawDeadzone();
            requestAnimationFrame(animate);
        }

        // Event listeners
        Object.keys(elements).forEach(key => {
            if (key !== 'presets') {
                elements[key].addEventListener('input', updateValues);
            }
        });

        elements.presets.addEventListener('change', (e) => {
            if (e.target.value !== 'custom') {
                const preset = presets[e.target.value];
                Object.keys(preset).forEach(key => {
                    if (elements[key]) {
                        elements[key].value = preset[key];
                    }
                });
                updateValues();
            }
        });

        // Reset function
        function resetSettings() {
            const defaultSettings = presets.default;
            Object.keys(defaultSettings).forEach(key => {
                if (elements[key]) {
                    elements[key].value = defaultSettings[key];
                }
            });
            elements.presets.value = 'default';
            updateValues();
        }

        // Export settings
        function exportSettings() {
            const settings = {};
            Object.keys(elements).forEach(key => {
                if (key !== 'presets') {
                    settings[key] = elements[key].value;
                }
            });
            
            const text = `Apex Legends ALC Settings:
==================
HIP FIRE:
Deadzone: ${settings.deadzone}%
Outer Threshold: ${settings.outerThreshold}%
Response Curve: ${settings.responseCurve}
Yaw Speed: ${settings.yawSpeed}
Pitch Speed: ${settings.pitchSpeed}
Turning Extra Yaw: ${settings.extraYaw}
Turning Extra Pitch: ${settings.extraPitch}
Ramp-up Time: ${settings.rampTime}%
Ramp-up Delay: ${settings.rampDelay}%

ADS:
ADS Yaw Speed: ${settings.adsYawSpeed}
ADS Pitch Speed: ${settings.adsPitchSpeed}
ADS Turning Extra Yaw: ${settings.adsExtraYaw}
ADS Turning Extra Pitch: ${settings.adsExtraPitch}
ADS Ramp-up Time: ${settings.adsRampTime}%
ADS Ramp-up Delay: ${settings.adsRampDelay}%`;
            
            navigator.clipboard.writeText(text).then(() => {
                alert('Settings copied to clipboard!');
            }).catch(() => {
                alert(text);
            });
        }

        // Import settings
        function importSettings() {
            const input = prompt('Paste your settings string here:');
            if (input) {
                try {
                    // Simple parser for the exported format
                    const lines = input.split('\n');
                    lines.forEach(line => {
                        const match = line.match(/^(.*?):\s*(\d+)%?$/);
                        if (match) {
                            const key = match[1].trim().toLowerCase().replace(/ /g, '');
                            const value = match[2];
                            
                            // Map the text to element IDs
                            const mapping = {
                                'deadzone': 'deadzone',
                                'outerthreshold': 'outerThreshold',
                                'responsecurve': 'responseCurve',
                                'yawspeed': 'yawSpeed',
                                'pitchspeed': 'pitchSpeed',
                                'turningextrayaw': 'extraYaw',
                                'turningextrapitch': 'extraPitch',
                                'ramp-uptime': 'rampTime',
                                'ramp-updelay': 'rampDelay',
                                'adsyawspeed': 'adsYawSpeed',
                                'adspitchspeed': 'adsPitchSpeed',
                                'adsturningextrayaw': 'adsExtraYaw',
                                'adsturningextrapitch': 'adsExtraPitch',
                                'adsramp-uptime': 'adsRampTime',
                                'adsramp-updelay': 'adsRampDelay'
                            };
                            
                            Object.keys(mapping).forEach(textKey => {
                                if (key.includes(textKey)) {
                                    const elementId = mapping[textKey];
                                    if (elements[elementId]) {
                                        elements[elementId].value = value;
                                    }
                                }
                            });
                        }
                    });
                    
                    elements.presets.value = 'custom';
                    updateValues();
                    alert('Settings imported successfully!');
                } catch (e) {
                    alert('Failed to import settings. Please check the format.');
                }
            }
        }

        // Update all visualizations
        function updateVisualizations() {
            drawResponseCurve();
            drawStrafeTracking();
            drawDiagonalVisualization();
            drawAimAssist();
            drawTurningExtra();
            drawSpeedComparison();
            drawAAMeters();
        }

        // Initialize
        updateValues();
        animate();
    </script>
</body>
</html>
