// Constants
const CONSTANTS = {
    COLORS: {
        PRIMARY: '#ff6b00',
        GRID: '#3a3a3a',
        AXES: '#666',
        TEXT_LIGHT: '#999',
        TEXT_WHITE: '#fff',
        DEADZONE: 'rgba(120, 40, 40, 0.4)',
        ACTIVE_ZONE: 'rgba(255, 255, 255, 0.1)',
        OUTER_ZONE: 'rgba(255, 107, 0, 0.15)',
        NO_AA_ZONE: 'rgba(120, 40, 40, 0.15)',
        AA_ACTIVE_ZONE: 'rgba(255, 255, 255, 0.05)'
    },
    THRESHOLDS: {
        HIP_YAW_MIN: 90,
        HIP_YAW_VIABLE: 130,
        HIP_YAW_MAX: 180,
        HIP_PITCH_MIN: 50,
        HIP_PITCH_VIABLE: 60,
        HIP_PITCH_MAX: 180,
        ADS_YAW_MIN: 45,
        ADS_YAW_VIABLE: 75,
        ADS_YAW_MAX: 120,
        ADS_PITCH_MIN: 45,
        ADS_PITCH_VIABLE: 75,
        ADS_PITCH_MAX: 120
    },
    AA: {
        HIP_MIN_RANGE: 3,
        HIP_MAX_RANGE: 33,
        STRENGTH: 0.3
    }
};

const SETTINGS_CONFIG = {
    hipfire: [
        { id: 'deadzone', label: 'Deadzone', min: 0, max: 50, default: 15, unit: '%', warningId: 'deadzoneWarning' },
        { id: 'outerThreshold', label: 'Outer Threshold', min: 0, max: 30, default: 2, unit: '%', warningId: 'outerThresholdWarning' },
        { id: 'responseCurve', label: 'Response Curve', min: 0, max: 30, default: 10, unit: '', separator: 33.33 },
        { section: 'Per Optic Settings...' },
        { id: 'yawSpeed', label: 'Yaw Speed', min: 0, max: 500, default: 160, unit: '', warningId: 'hipYawWarning' },
        { id: 'pitchSpeed', label: 'Pitch Speed', min: 0, max: 500, default: 120, unit: '', warningId: 'hipPitchWarning' },
        { id: 'extraYaw', label: 'Turning Extra Yaw', min: 0, max: 250, default: 220, unit: '' },
        { id: 'extraPitch', label: 'Turning Extra Pitch', min: 0, max: 250, default: 0, unit: '' },
        { id: 'rampTime', label: 'Turning Ramp-up Time', min: 0, max: 100, default: 33, unit: '%', separator: 40, warningId: 'hipRampWarning' },
        { id: 'rampDelay', label: 'Turning Ramp-up Delay', min: 0, max: 100, default: 0, unit: '%' }
    ],
    ads: [
        { id: 'adsYawSpeed', label: 'ADS Yaw Speed', min: 0, max: 500, default: 110, unit: '', warningId: 'adsYawWarning' },
        { id: 'adsPitchSpeed', label: 'ADS Pitch Speed', min: 0, max: 500, default: 75, unit: '', warningId: 'adsPitchWarning' },
        { id: 'adsExtraYaw', label: 'ADS Turning Extra Yaw', min: 0, max: 250, default: 30, unit: '' },
        { id: 'adsExtraPitch', label: 'ADS Turning Extra Pitch', min: 0, max: 250, default: 30, unit: '' },
        { id: 'adsRampTime', label: 'ADS Turning Ramp-up Time', min: 0, max: 100, default: 100, unit: '%', separator: 40, warningId: 'adsRampWarning' },
        { id: 'adsRampDelay', label: 'ADS Turning Ramp-up Delay', min: 0, max: 100, default: 25, unit: '%' }
    ]
};

const PRESETS = {
    default: {
        deadzone: 15, outerThreshold: 2, responseCurve: 10,
        yawSpeed: 160, pitchSpeed: 120, extraYaw: 220, extraPitch: 0,
        rampTime: 33, rampDelay: 0,
        adsYawSpeed: 110, adsPitchSpeed: 75, adsExtraYaw: 30, adsExtraPitch: 30,
        adsRampTime: 100, adsRampDelay: 25
    },
    genburten: {
        deadzone: 0, outerThreshold: 2, responseCurve: 0,
        yawSpeed: 500, pitchSpeed: 500, extraYaw: 0, extraPitch: 0,
        rampTime: 0, rampDelay: 0,
        adsYawSpeed: 130, adsPitchSpeed: 130, adsExtraYaw: 0, adsExtraPitch: 0,
        adsRampTime: 0, adsRampDelay: 0
    },
    extesyy: {
        deadzone: 0, outerThreshold: 2, responseCurve: 1,
        yawSpeed: 350, pitchSpeed: 320, extraYaw: 0, extraPitch: 0,
        rampTime: 0, rampDelay: 0,
        adsYawSpeed: 110, adsPitchSpeed: 110, adsExtraYaw: 0, adsExtraPitch: 0,
        adsRampTime: 0, adsRampDelay: 0
    }
};

class ALCAnalyzer {
    constructor() {
        this.state = { ...PRESETS.default };
        this.canvases = {};
        this.contexts = {};
        this.aaViewMode = 'hipfire';
        this.animationId = null;
        
        this.init();
    }
    
    init() {
        this.initCanvases();
        this.generateSettings();
        this.attachEventListeners();
        this.updateAll();
        this.startAnimation();
    }
    
    initCanvases() {
        const canvasIds = ['deadzoneCanvas', 'curveCanvas', 'strafeCanvas', 
                          'diagonalCanvas', 'aimAssistCanvas', 'speedComparisonCanvas', 'aimAssist3DCanvas'];
        
        canvasIds.forEach(id => {
            const canvas = document.getElementById(id);
            if (canvas) {
                this.canvases[id] = canvas;
                this.contexts[id] = canvas.getContext('2d');
            }
        });
        
        // Initialize 3D visualization properties
        this.rotation3D = { x: -0.3, y: 0.5, z: 0 };
        this.autoRotate3D = false;
        this.isDragging = false;
        this.lastMousePos = { x: 0, y: 0 };
        
        // Add mouse interaction for 3D canvas
        const canvas3D = this.canvases.aimAssist3DCanvas;
        if (canvas3D) {
            canvas3D.addEventListener('mousedown', (e) => this.handle3DMouseDown(e));
            canvas3D.addEventListener('mousemove', (e) => this.handle3DMouseMove(e));
            canvas3D.addEventListener('mouseup', () => this.handle3DMouseUp());
            canvas3D.addEventListener('mouseleave', () => this.handle3DMouseUp());
            
            // Touch support for mobile
            canvas3D.addEventListener('touchstart', (e) => {
                e.preventDefault();
                const touch = e.touches[0];
                this.handle3DMouseDown(touch);
            });
            canvas3D.addEventListener('touchmove', (e) => {
                e.preventDefault();
                const touch = e.touches[0];
                this.handle3DMouseMove(touch);
            });
            canvas3D.addEventListener('touchend', () => this.handle3DMouseUp());
        }
    }
    
    generateSettings() {
        const hipfireTab = document.getElementById('hipfire-tab');
        const adsTab = document.getElementById('ads-tab');
        
        this.generateSettingsHTML(hipfireTab, SETTINGS_CONFIG.hipfire);
        this.generateSettingsHTML(adsTab, SETTINGS_CONFIG.ads);
    }
    
    generateSettingsHTML(container, settings) {
        settings.forEach(setting => {
            if (setting.section) {
                const sectionDiv = document.createElement('div');
                sectionDiv.className = 'section-header';
                sectionDiv.textContent = setting.section;
                container.appendChild(sectionDiv);
            } else {
                const settingRow = document.createElement('div');
                settingRow.className = 'setting-row';
                const currentValue = this.state[setting.id] || setting.default;
                settingRow.innerHTML = `
                    <div class="setting-label">${setting.label}</div>
                    <div class="slider-container">
                        <input type="range" class="slider-input" id="${setting.id}" 
                               min="${setting.min}" max="${setting.max}" value="${currentValue}" step="1">
                        <div class="slider-fill" id="${setting.id}Fill"></div>
                        <div class="slider-indicator" id="${setting.id}Indicator"></div>
                        ${setting.separator ? `<div class="slider-separator" id="${setting.id}Separator" style="left: ${setting.separator}%"></div>` : ''}
                    </div>
                    <div class="setting-value" id="${setting.id}Value">${currentValue}${setting.unit}</div>
                `;
                container.appendChild(settingRow);
                
                if (setting.warningId) {
                    const warningDiv = document.createElement('div');
                    warningDiv.id = setting.warningId;
                    container.appendChild(warningDiv);
                }
                
                const slider = settingRow.querySelector('.slider-input');
                slider.addEventListener('input', () => this.handleSliderChange(setting.id));
                
                this.updateSliderVisual(setting.id);
            }
        });
    }
    
    attachEventListeners() {
        document.querySelectorAll('.tab-button').forEach(btn => {
            btn.addEventListener('click', (e) => this.switchTab(e.target.dataset.tab));
        });
        
        document.querySelectorAll('.viz-tab').forEach(btn => {
            btn.addEventListener('click', (e) => this.switchVizTab(e.target.dataset.viz));
        });
        
        document.querySelectorAll('[data-aa-mode]').forEach(btn => {
            btn.addEventListener('click', (e) => this.setAAMode(e.target.dataset.aaMode));
        });
        
        document.getElementById('presets').addEventListener('change', (e) => this.loadPreset(e.target.value));
        
        document.getElementById('reset-btn').addEventListener('click', () => this.resetSettings());
        document.getElementById('export-btn').addEventListener('click', () => this.exportSettings());
        document.getElementById('import-btn').addEventListener('click', () => this.importSettings());
        
        // 3D rotation toggle
        const rotate3DBtn = document.getElementById('rotate3D');
        if (rotate3DBtn) {
            rotate3DBtn.addEventListener('click', () => {
                this.autoRotate3D = !this.autoRotate3D;
                rotate3DBtn.textContent = this.autoRotate3D ? 'Stop Rotation' : 'Toggle Rotation';
            });
        }
    }
    
    handle3DMouseDown(e) {
        this.isDragging = true;
        const rect = this.canvases.aimAssist3DCanvas.getBoundingClientRect();
        this.lastMousePos = {
            x: e.clientX - rect.left,
            y: e.clientY - rect.top
        };
    }
    
    handle3DMouseMove(e) {
        if (!this.isDragging) return;
        
        const rect = this.canvases.aimAssist3DCanvas.getBoundingClientRect();
        const currentPos = {
            x: e.clientX - rect.left,
            y: e.clientY - rect.top
        };
        
        const deltaX = currentPos.x - this.lastMousePos.x;
        const deltaY = currentPos.y - this.lastMousePos.y;
        
        this.rotation3D.y += deltaX * 0.01;
        this.rotation3D.x += deltaY * 0.01;
        
        // Clamp X rotation to prevent flipping
        this.rotation3D.x = Math.max(-Math.PI/2, Math.min(Math.PI/2, this.rotation3D.x));
        
        this.lastMousePos = currentPos;
        this.draw3DAimAssist();
    }
    
    handle3DMouseUp() {
        this.isDragging = false;
    }
    
    handleSliderChange(settingId) {
        const slider = document.getElementById(settingId);
        if (slider) {
            this.state[settingId] = parseInt(slider.value);
            this.updateSliderVisual(settingId);
            this.updateAll();
        }
    }
    
    updateSliderVisual(settingId) {
        const slider = document.getElementById(settingId);
        const fill = document.getElementById(settingId + 'Fill');
        const indicator = document.getElementById(settingId + 'Indicator');
        const valueDisplay = document.getElementById(settingId + 'Value');
        
        if (!slider || !fill || !indicator || !valueDisplay) return;
        
        const value = parseInt(slider.value);
        const max = parseInt(slider.max);
        const percentage = (value / max) * 100;
        
        fill.style.width = percentage + '%';
        indicator.style.left = percentage + '%';
        
        const allSettings = [...SETTINGS_CONFIG.hipfire, ...SETTINGS_CONFIG.ads];
        const setting = allSettings.find(s => s.id === settingId);
        valueDisplay.textContent = value + (setting?.unit || '');
    }
    
    switchTab(tab) {
        document.querySelectorAll('.tab-button').forEach(btn => btn.classList.remove('active'));
        document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
        
        document.querySelector(`[data-tab="${tab}"]`).classList.add('active');
        document.getElementById(`${tab}-tab`).classList.add('active');
    }
    
    switchVizTab(tab) {
        document.querySelectorAll('.viz-tab').forEach(btn => btn.classList.remove('active'));
        document.querySelectorAll('.viz-content').forEach(content => content.classList.remove('active'));
        
        document.querySelector(`[data-viz="${tab}"]`).classList.add('active');
        document.getElementById(`${tab}-viz`).classList.add('active');
    }
    
    setAAMode(mode) {
        this.aaViewMode = mode;
        document.querySelectorAll('[data-aa-mode]').forEach(btn => {
            btn.style.backgroundColor = btn.dataset.aaMode === mode ? CONSTANTS.COLORS.PRIMARY : '#555';
        });
        this.updateAAInfo();
        this.drawAimAssist();
        this.draw3DAimAssist();
    }
    
    updateAAInfo() {
        const infoContent = document.getElementById('aaInfoContent');
        if (!infoContent) return;
        
        if (this.aaViewMode === 'hipfire') {
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
    }
    
    loadPreset(presetName) {
        if (presetName !== 'custom' && PRESETS[presetName]) {
            const preset = PRESETS[presetName];
            Object.keys(preset).forEach(key => {
                this.state[key] = preset[key];
                const slider = document.getElementById(key);
                if (slider) {
                    slider.value = preset[key];
                    this.updateSliderVisual(key);
                }
            });
            this.updateAll();
        }
    }
    
    resetSettings() {
        const preset = PRESETS.default;
        Object.keys(preset).forEach(key => {
            this.state[key] = preset[key];
            const slider = document.getElementById(key);
            if (slider) {
                slider.value = preset[key];
                this.updateSliderVisual(key);
            }
        });
        document.getElementById('presets').value = 'default';
        this.updateAll();
    }
    
    exportSettings() {
        const settings = Object.keys(this.state).reduce((acc, key) => {
            acc[key] = this.state[key];
            return acc;
        }, {});
        
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
    
    importSettings() {
        const input = prompt('Paste your settings string here:');
        if (!input) return;
        
        try {
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
            
            const lines = input.split('\n');
            lines.forEach(line => {
                const match = line.match(/^(.*?):\s*(\d+)%?$/);
                if (match) {
                    const key = match[1].trim().toLowerCase().replace(/ /g, '');
                    const value = parseInt(match[2]);
                    
                    Object.keys(mapping).forEach(textKey => {
                        if (key.includes(textKey)) {
                            const settingId = mapping[textKey];
                            this.state[settingId] = value;
                            const slider = document.getElementById(settingId);
                            if (slider) {
                                slider.value = value;
                                this.updateSliderVisual(settingId);
                            }
                        }
                    });
                }
            });
            
            document.getElementById('presets').value = 'custom';
            this.updateAll();
            alert('Settings imported successfully!');
        } catch (e) {
            alert('Failed to import settings. Please check the format.');
        }
    }
    
    updateAll() {
        this.updateWarnings();
        this.updateVisualizations();
        this.updateAnalysis();
        this.updateStats();
    }
    
    updateWarnings() {
        this.updateSpeedWarnings('yawSpeed', 'hipYawWarning', 'hip');
        this.updateSpeedWarnings('pitchSpeed', 'hipPitchWarning', 'hip_pitch');
        this.updateSpeedWarnings('adsYawSpeed', 'adsYawWarning', 'ads');
        this.updateSpeedWarnings('adsPitchSpeed', 'adsPitchWarning', 'ads_pitch');
        
        const outerWarning = document.getElementById('outerThresholdWarning');
        if (outerWarning) {
            outerWarning.innerHTML = this.state.outerThreshold < 2 
                ? '<div class="warning warning-red">⚠️ ALPS controllers need minimum 2% to avoid edge detection issues</div>'
                : '';
        }
    }
    
    updateSpeedWarnings(settingId, warningId, type) {
        const value = this.state[settingId];
        const warning = document.getElementById(warningId);
        if (!warning) return;
        
        let html = '';
        const t = CONSTANTS.THRESHOLDS;
        
        switch(type) {
            case 'hip':
                if (value < t.HIP_YAW_MIN) {
                    html = '<div class="warning warning-red">⚠️ Below 90°/s - Cannot track close range strafes at 3m</div>';
                } else if (value < t.HIP_YAW_VIABLE) {
                    html = '<div class="warning warning-yellow">⚡ Minimum viable - limited strafe tracking</div>';
                } else if (value > t.HIP_YAW_MAX) {
                    html = '<div class="warning warning-yellow">⚠️ Exceeding 180°/s - Extra speed may be hard to control</div>';
                } else {
                    html = '<div class="warning warning-green">✓ Good for close range tracking</div>';
                }
                break;
                
            case 'hip_pitch':
                if (value < t.HIP_PITCH_MIN) {
                    html = '<div class="warning warning-red">⚠️ Below 50°/s - Cannot track close range vertical movement</div>';
                } else if (value <= t.HIP_PITCH_VIABLE) {
                    html = '<div class="warning warning-yellow">⚡ Minimum viable - limited vertical tracking</div>';
                } else if (value > t.HIP_PITCH_MAX) {
                    html = '<div class="warning warning-yellow">⚠️ Exceeding 180°/s - Extra speed may be hard to control</div>';
                } else {
                    html = '<div class="warning warning-green">✓ Good vertical tracking</div>';
                }
                break;
                
            case 'ads':
                if (value < t.ADS_YAW_MIN) {
                    html = '<div class="warning warning-red">⚠️ Below 45°/s - Cannot track basic movement</div>';
                } else if (value < t.ADS_YAW_VIABLE) {
                    html = '<div class="warning warning-yellow">⚡ Minimum viable for tracking</div>';
                } else if (value > t.ADS_YAW_MAX) {
                    html = '<div class="warning warning-yellow">⚠️ Exceeding 120°/s - May be too fast for ADS precision</div>';
                } else {
                    html = '<div class="warning warning-green">✓ Good tracking potential</div>';
                }
                break;
                
            case 'ads_pitch':
                if (value < t.ADS_PITCH_MIN) {
                    html = '<div class="warning warning-red">⚠️ Below 45°/s - Cannot track basic movement</div>';
                } else if (value < t.ADS_PITCH_VIABLE) {
                    html = '<div class="warning warning-yellow">⚡ Minimum viable for tracking</div>';
                } else if (value > t.ADS_PITCH_MAX) {
                    html = '<div class="warning warning-yellow">⚠️ Exceeding 120°/s - May be too fast for ADS precision</div>';
                } else {
                    html = '<div class="warning warning-green">✓ Good tracking potential</div>';
                }
                break;
        }
        
        warning.innerHTML = html;
    }
    
    updateStats() {
        const stats = {
            hip180Time: (180 / this.state.yawSpeed).toFixed(2),
            hip180TimeExtra: (180 / (this.state.yawSpeed + this.state.extraYaw)).toFixed(2),
            ads180Time: (180 / this.state.adsYawSpeed).toFixed(2),
            ads180TimeExtra: (180 / (this.state.adsYawSpeed + this.state.adsExtraYaw)).toFixed(2),
            hipBaseSpeed: this.state.yawSpeed,
            hipMaxSpeed: this.state.yawSpeed + this.state.extraYaw,
            adsBaseSpeed: this.state.adsYawSpeed,
            adsMaxSpeed: this.state.adsYawSpeed + this.state.adsExtraYaw
        };
        
        Object.keys(stats).forEach(key => {
            const element = document.getElementById(key);
            if (element) {
                element.textContent = key.includes('Time') ? stats[key] + 's' : stats[key] + '°/s';
            }
        });
    }
    
    updateAnalysis() {
        this.updateMainAnalysis();
        this.updateDiagonalUniformity();
        this.updateMicroAdjustment();
    }
    
    updateMainAnalysis() {
        const { deadzone, responseCurve: curve, yawSpeed: hipYaw, pitchSpeed: hipPitch, 
                adsYawSpeed: adsYaw, extraYaw } = this.state;
        
        let analysis = "";
        
        if (deadzone === 0) {
            analysis += "• Perfect deadzone: Maximum micro-adjustment capability.<br>";
        } else if (deadzone < 5) {
            analysis += "• Excellent deadzone: Great micro-adjustments with minimal input.<br>";
        } else if (deadzone < 15) {
            analysis += "• Moderate deadzone: Balanced but could benefit from lowering.<br>";
        } else {
            analysis += "• High deadzone: Limiting your micro-adjustment potential significantly.<br>";
        }
        
        if (curve == 0) {
            analysis += "• Linear response: Maximum control for recoil and tracking. High skill ceiling.<br>";
        } else if (curve <= 5) {
            analysis += "• Mild curve: Good balance between control and forgiveness.<br>";
        } else if (curve == 10) {
            analysis += "• Classic curve: Forgiving and familiar, but less precise than linear.<br>";
        } else {
            analysis += "• Heavy curve: Very forgiving but sacrifices precision and consistency.<br>";
        }
        
        if (hipYaw < CONSTANTS.THRESHOLDS.HIP_YAW_MIN) {
            analysis += "• ⚠️ CRITICAL: Hip fire too slow for close range! Increase to at least 90°/s.<br>";
        } else if (hipYaw < CONSTANTS.THRESHOLDS.HIP_YAW_VIABLE) {
            analysis += "• Hip fire speed is minimum viable. Consider increasing for better close range.<br>";
        }
        
        if (adsYaw < CONSTANTS.THRESHOLDS.ADS_YAW_MIN) {
            analysis += "• ⚠️ CRITICAL: ADS too slow for basic tracking! Increase to at least 45°/s.<br>";
        } else if (adsYaw < CONSTANTS.THRESHOLDS.ADS_YAW_VIABLE) {
            analysis += "• ADS speed is minimum viable. Consider increasing for better tracking.<br>";
        }
        
        const hipUniformity = this.calculateUniformity(hipYaw, hipPitch);
        if (hipUniformity < 70) {
            analysis += "• ⚠️ Poor diagonal uniformity! Match yaw/pitch speeds for consistent aim.<br>";
        } else if (hipUniformity < 85) {
            analysis += "• Diagonal movement may feel slightly inconsistent.<br>";
        }
        
        if (extraYaw > 100) {
            analysis += "• High turning extra enables quick 180s while maintaining low base sens.<br>";
        } else if (extraYaw === 0) {
            analysis += "• No turning extra: Consider adding some for emergency flicks.<br>";
        }
        
        const avgSpeed = (hipYaw + hipPitch) / 2;
        if (curve === 0 && deadzone < 5 && avgSpeed > 150 && hipUniformity > 85) {
            analysis += "<br><strong>🏆 Pro-level setup detected! High skill ceiling configuration.</strong>";
        } else if (curve > 15 || deadzone > 20) {
            analysis += "<br><strong>⚠️ Settings may be limiting your potential. Consider moving toward linear/low deadzone.</strong>";
        }
        
        document.getElementById('analysisText').innerHTML = analysis;
    }
    
    calculateUniformity(yaw, pitch) {
        const min = Math.min(yaw, pitch);
        const max = Math.max(yaw, pitch);
        return max > 0 ? (min / max * 100) : 100;
    }
    
    updateDiagonalUniformity() {
        const hipUniformity = this.calculateUniformity(this.state.yawSpeed, this.state.pitchSpeed);
        const adsUniformity = this.calculateUniformity(this.state.adsYawSpeed, this.state.adsPitchSpeed);
        
        document.getElementById('hipUniformityBar').style.width = hipUniformity + '%';
        document.getElementById('hipUniformityLabel').textContent = Math.round(hipUniformity) + '%';
        document.getElementById('adsUniformityBar').style.width = adsUniformity + '%';
        document.getElementById('adsUniformityLabel').textContent = Math.round(adsUniformity) + '%';
        
        const worstUniformity = Math.min(hipUniformity, adsUniformity);
        const statusEl = document.getElementById('uniformityStatus');
        const textEl = document.getElementById('uniformityText');
        
        if (worstUniformity >= 80) {
            statusEl.style.color = CONSTANTS.COLORS.PRIMARY;
            statusEl.textContent = '✓ Excellent Diagonal Uniformity';
            textEl.textContent = 'Your diagonal movement will feel consistent and predictable. Pro-level settings!';
        } else if (worstUniformity >= 60) {
            statusEl.style.color = '#ffcc00';
            statusEl.textContent = '⚡ Acceptable Diagonal Uniformity';
            textEl.textContent = 'Some diagonal inconsistency. Consider matching yaw/pitch closer for better feel.';
        } else {
            statusEl.style.color = '#ff6666';
            statusEl.textContent = '⚠️ Poor Diagonal Uniformity';
            textEl.textContent = 'Diagonal tracking will feel very inconsistent! Match yaw and pitch speeds.';
        }
    }
    
    updateMicroAdjustment() {
        const capability = Math.max(0, 100 - this.state.deadzone * 2);
        
        document.getElementById('microBar').style.width = capability + '%';
        document.getElementById('microLabel').textContent = capability + '%';
        
        let text;
        if (this.state.deadzone === 0) {
            text = "Perfect micro-adjustments - maximum precision possible";
        } else if (this.state.deadzone < 5) {
            text = "Excellent micro-adjustments - minimal input required";
        } else if (this.state.deadzone < 15) {
            text = "Good micro-adjustments - balanced precision";
        } else {
            text = "Limited micro-adjustments - requires larger movements";
        }
        document.getElementById('microText').textContent = text;
    }
    
    updateVisualizations() {
        this.drawResponseCurve();
        this.drawStrafeTracking();
        this.drawDiagonalVisualization();
        this.drawAimAssist();
        this.draw3DAimAssist();
        this.drawSpeedComparison();
    }
    
    applyDeadzone(x, y) {
        const magnitude = Math.sqrt(x * x + y * y);
        const deadzoneValue = this.state.deadzone / 100;
        const outerValue = this.state.outerThreshold / 100;
        
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
    
    applyResponseCurve(input) {
        const curveValue = this.state.responseCurve;
        const absInput = Math.abs(input);
        let output;
        
        if (curveValue == 0) {
            output = absInput;
        } else if (curveValue <= 5) {
            const power = 1 + (curveValue * 0.2);
            output = Math.pow(absInput, power);
        } else if (curveValue <= 9) {
            const t = (curveValue - 5) / 4;
            const linearOutput = absInput;
            const classicOutput = Math.pow(absInput, 2.2);
            output = linearOutput * (1 - t) + classicOutput * t;
        } else if (curveValue == 10) {
            output = Math.pow(absInput, 2.2);
        } else if (curveValue < 20) {
            const power = 2.2 + (curveValue - 10) * 0.15;
            output = Math.pow(absInput, power);
        } else {
            const power = 3.7 + (curveValue - 20) * 0.25;
            output = Math.pow(absInput, power);
        }
        
        return Math.sign(input) * output;
    }
    
    drawDeadzone() {
        const ctx = this.contexts.deadzoneCanvas;
        const canvas = this.canvases.deadzoneCanvas;
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        const maxRadius = Math.min(centerX, centerY) - 20;
        
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        ctx.fillStyle = '#3a3a3a';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        ctx.strokeStyle = '#666';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(centerX, centerY, maxRadius, 0, Math.PI * 2);
        ctx.stroke();
        
        const outerThresholdRadius = maxRadius * (1 - this.state.outerThreshold / 100);
        ctx.fillStyle = 'rgba(255, 107, 0, 0.15)';
        ctx.beginPath();
        ctx.arc(centerX, centerY, maxRadius, 0, Math.PI * 2);
        ctx.arc(centerX, centerY, outerThresholdRadius, 0, Math.PI * 2, true);
        ctx.fill();
        
        const deadzoneRadius = maxRadius * (this.state.deadzone / 100);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
        ctx.beginPath();
        ctx.arc(centerX, centerY, outerThresholdRadius, 0, Math.PI * 2);
        ctx.arc(centerX, centerY, deadzoneRadius, 0, Math.PI * 2, true);
        ctx.fill();
        
        ctx.fillStyle = 'rgba(120, 40, 40, 0.4)';
        ctx.beginPath();
        ctx.arc(centerX, centerY, deadzoneRadius, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.strokeStyle = '#ff6b00';
        ctx.lineWidth = 2;
        ctx.shadowBlur = 10;
        ctx.shadowColor = '#ff6b00';
        ctx.beginPath();
        ctx.moveTo(centerX - 10, centerY);
        ctx.lineTo(centerX + 10, centerY);
        ctx.moveTo(centerX, centerY - 10);
        ctx.lineTo(centerX, centerY + 10);
        ctx.stroke();
        ctx.shadowBlur = 0;
        
        const stickAngle = Date.now() / 2000;
        const stickRadius = maxRadius * 0.7;
        const stickX = Math.cos(stickAngle) * stickRadius / maxRadius;
        const stickY = Math.sin(stickAngle) * stickRadius / maxRadius;
        
        const processed = this.applyDeadzone(stickX, stickY);
        
        ctx.fillStyle = '#666';
        ctx.beginPath();
        ctx.arc(centerX + stickX * maxRadius, centerY + stickY * maxRadius, 6, 0, Math.PI * 2);
        ctx.fill();
        
        if (!processed.inDeadzone) {
            ctx.fillStyle = '#ff6b00';
            ctx.shadowBlur = 15;
            ctx.shadowColor = '#ff6b00';
            ctx.beginPath();
            ctx.arc(centerX + processed.x * maxRadius, centerY + processed.y * maxRadius, 6, 0, Math.PI * 2);
            ctx.fill();
            ctx.shadowBlur = 0;
            
            ctx.strokeStyle = '#ff6b00';
            ctx.lineWidth = 2;
            ctx.setLineDash([5, 5]);
            ctx.beginPath();
            ctx.moveTo(centerX + stickX * maxRadius, centerY + stickY * maxRadius);
            ctx.lineTo(centerX + processed.x * maxRadius, centerY + processed.y * maxRadius);
            ctx.stroke();
            ctx.setLineDash([]);
        }
    }
    
    drawResponseCurve() {
        const ctx = this.contexts.curveCanvas;
        const canvas = this.canvases.curveCanvas;
        const width = canvas.width;
        const height = canvas.height;
        const padding = 30;
        const graphWidth = width - 2 * padding;
        const graphHeight = height - 2 * padding;
        
        ctx.clearRect(0, 0, width, height);
        ctx.fillStyle = CONSTANTS.COLORS.GRID;
        ctx.fillRect(0, 0, width, height);
        
        const deadzonePercent = this.state.deadzone / 100;
        const outerThresholdPercent = Math.max(0.01, this.state.outerThreshold / 100);
        
        ctx.strokeStyle = CONSTANTS.COLORS.GRID;
        ctx.lineWidth = 1;
        
        for (let i = 0; i <= 10; i++) {
            const x = padding + (i / 10) * graphWidth;
            ctx.beginPath();
            ctx.moveTo(x, padding);
            ctx.lineTo(x, height - padding);
            ctx.stroke();
            
            const y = padding + (i / 10) * graphHeight;
            ctx.beginPath();
            ctx.moveTo(padding, y);
            ctx.lineTo(width - padding, y);
            ctx.stroke();
        }
        
        ctx.strokeStyle = CONSTANTS.COLORS.AXES;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(padding, height - padding);
        ctx.lineTo(width - padding, height - padding);
        ctx.moveTo(padding, padding);
        ctx.lineTo(padding, height - padding);
        ctx.stroke();
        
        ctx.strokeStyle = '#444';
        ctx.lineWidth = 1;
        ctx.setLineDash([5, 5]);
        ctx.beginPath();
        ctx.moveTo(padding, height - padding);
        ctx.lineTo(width - padding, padding);
        ctx.stroke();
        ctx.setLineDash([]);
        
        if (deadzonePercent > 0) {
            ctx.fillStyle = 'rgba(120, 40, 40, 0.2)';
            ctx.fillRect(padding, padding, deadzonePercent * graphWidth, graphHeight);
        }
        
        ctx.fillStyle = 'rgba(255, 107, 0, 0.1)';
        ctx.fillRect(
            padding + (1 - outerThresholdPercent) * graphWidth, 
            padding, 
            outerThresholdPercent * graphWidth, 
            graphHeight
        );
        
        ctx.strokeStyle = CONSTANTS.COLORS.PRIMARY;
        ctx.lineWidth = 3;
        ctx.shadowBlur = 10;
        ctx.shadowColor = CONSTANTS.COLORS.PRIMARY;
        ctx.beginPath();
        
        for (let i = 0; i <= 100; i++) {
            const rawInput = i / 100;
            let x = padding + rawInput * graphWidth;
            let y = height - padding;
            
            if (rawInput <= deadzonePercent) {
                y = height - padding;
            } else if (rawInput >= 1 - outerThresholdPercent) {
                y = padding;
            } else {
                const normalizedInput = (rawInput - deadzonePercent) / (1 - deadzonePercent - outerThresholdPercent);
                const curvedOutput = this.applyResponseCurve(normalizedInput);
                y = height - padding - curvedOutput * graphHeight;
            }
            
            if (i === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
        }
        
        ctx.stroke();
        ctx.shadowBlur = 0;
        
        ctx.fillStyle = CONSTANTS.COLORS.TEXT_LIGHT;
        ctx.font = '12px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('Input', width / 2, height - 5);
        ctx.save();
        ctx.translate(10, height / 2);
        ctx.rotate(-Math.PI / 2);
        ctx.fillText('Output', 0, 0);
        ctx.restore();
    }
    
    drawStrafeTracking() {
        const ctx = this.contexts.strafeCanvas;
        const canvas = this.canvases.strafeCanvas;
        const width = canvas.width;
        const height = canvas.height;
        const padding = 40;
        const graphWidth = width - 2 * padding;
        const graphHeight = height - 2 * padding;
        
        ctx.clearRect(0, 0, width, height);
        ctx.fillStyle = CONSTANTS.COLORS.GRID;
        ctx.fillRect(0, 0, width, height);
        
        const hipYaw = this.state.yawSpeed;
        const adsYaw = this.state.adsYawSpeed;
        
        const maxDistance = 50;
        const maxSpeed = 200;
        
        ctx.strokeStyle = CONSTANTS.COLORS.GRID;
        ctx.lineWidth = 1;
        
        const distances = [3, 10, 20, 30, 40, 50];
        distances.forEach(dist => {
            const x = padding + (dist / maxDistance) * graphWidth;
            ctx.beginPath();
            ctx.moveTo(x, padding);
            ctx.lineTo(x, height - padding);
            ctx.stroke();
            
            ctx.fillStyle = CONSTANTS.COLORS.AXES;
            ctx.font = '10px Arial';
            ctx.textAlign = 'center';
            ctx.fillText(dist + 'm', x, height - padding + 15);
        });
        
        const speeds = [0, 25, 50, 75, 100, 125, 150, 175, 200];
        speeds.forEach(speed => {
            const y = height - padding - (speed / maxSpeed) * graphHeight;
            ctx.beginPath();
            ctx.moveTo(padding, y);
            ctx.lineTo(width - padding, y);
            ctx.stroke();
            
            ctx.fillStyle = CONSTANTS.COLORS.AXES;
            ctx.font = '10px Arial';
            ctx.textAlign = 'right';
            ctx.fillText(speed + '°/s', padding - 5, y + 3);
        });
        
        ctx.fillStyle = 'rgba(255, 255, 255, 0.05)';
        ctx.beginPath();
        ctx.moveTo(padding, padding);
        ctx.lineTo(width - padding, padding);
        
        for (let x = width - padding; x >= padding; x--) {
            const dist = ((x - padding) / graphWidth) * maxDistance;
            if (dist < 3) continue;
            const requiredSpeed = 90 * (3 / dist);
            const y = height - padding - (Math.min(requiredSpeed, maxSpeed) / maxSpeed) * graphHeight;
            ctx.lineTo(x, y);
        }
        
        ctx.closePath();
        ctx.fill();
        
        ctx.fillStyle = 'rgba(120, 40, 40, 0.15)';
        ctx.beginPath();
        
        ctx.moveTo(padding, height - padding);
        
        for (let x = padding; x <= width - padding; x++) {
            const dist = ((x - padding) / graphWidth) * maxDistance;
            if (dist < 3) {
                ctx.lineTo(x, padding);
            } else {
                const requiredSpeed = 90 * (3 / dist);
                const y = height - padding - (Math.min(requiredSpeed, maxSpeed) / maxSpeed) * graphHeight;
                ctx.lineTo(x, y);
            }
        }
        
        ctx.lineTo(width - padding, height - padding);
        ctx.closePath();
        ctx.fill();
        
        ctx.strokeStyle = CONSTANTS.COLORS.PRIMARY;
        ctx.lineWidth = 3;
        ctx.beginPath();
        
        for (let x = padding; x <= width - padding; x++) {
            const dist = ((x - padding) / graphWidth) * maxDistance;
            if (dist < 3) continue;
            const requiredSpeed = 90 * (3 / dist);
            const y = height - padding - (Math.min(requiredSpeed, maxSpeed) / maxSpeed) * graphHeight;
            
            if (x === padding || dist === 3) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
        }
        ctx.stroke();
        
        ctx.strokeStyle = '#888';
        ctx.lineWidth = 2;
        ctx.beginPath();
        
        for (let x = padding; x <= width - padding; x++) {
            const dist = ((x - padding) / graphWidth) * maxDistance;
            if (dist < 3) continue;
            const requiredSpeed = 45 * (3 / dist);
            const y = height - padding - (Math.min(requiredSpeed, maxSpeed) / maxSpeed) * graphHeight;
            
            if (x === padding || dist === 3) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
        }
        ctx.stroke();
        
        const hipY = height - padding - (hipYaw / maxSpeed) * graphHeight;
        ctx.strokeStyle = CONSTANTS.COLORS.TEXT_WHITE;
        ctx.lineWidth = 3;
        ctx.setLineDash([10, 5]);
        ctx.beginPath();
        ctx.moveTo(padding, hipY);
        ctx.lineTo(width - padding, hipY);
        ctx.stroke();
        
        const adsY = height - padding - (adsYaw / maxSpeed) * graphHeight;
        ctx.strokeStyle = CONSTANTS.COLORS.TEXT_LIGHT;
        ctx.lineWidth = 2;
        ctx.setLineDash([5, 5]);
        ctx.beginPath();
        ctx.moveTo(padding, adsY);
        ctx.lineTo(width - padding, adsY);
        ctx.stroke();
        ctx.setLineDash([]);
        
        ctx.font = '11px Arial';
        ctx.fillStyle = CONSTANTS.COLORS.TEXT_WHITE;
        ctx.textAlign = 'left';
        ctx.fillText(`Your Hip Fire: ${hipYaw}°/s`, padding + 10, hipY - 5);
        
        ctx.fillStyle = CONSTANTS.COLORS.TEXT_LIGHT;
        ctx.fillText(`Your ADS: ${adsYaw}°/s`, padding + 10, adsY + 12);
        
        ctx.strokeStyle = CONSTANTS.COLORS.AXES;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(padding, height - padding);
        ctx.lineTo(width - padding, height - padding);
        ctx.moveTo(padding, padding);
        ctx.lineTo(padding, height - padding);
        ctx.stroke();
        
        const hipCanTrackAt3m = hipYaw >= 90;
        const adsCanTrackAt3m = adsYaw >= 45;
        const statusBox = document.getElementById('strafeStatusBox');
        
        if (hipCanTrackAt3m && adsCanTrackAt3m) {
            statusBox.style.display = 'block';
            statusBox.innerHTML = '<div style="color: #ff6b00; font-size: 18px; font-weight: bold;">✓ Both Hip Fire and ADS can track at all engagement ranges!</div>';
        } else if (!hipCanTrackAt3m && !adsCanTrackAt3m) {
            const hipClosest = Math.ceil(270 / hipYaw);
            const adsClosest = Math.ceil(135 / adsYaw);
            statusBox.style.display = 'block';
            statusBox.innerHTML = `<div style="color: #ff6666; font-size: 16px; font-weight: bold;">⚠️ Hip Fire: Cannot track closer than ${hipClosest}m<br>⚠️ ADS: Cannot track closer than ${adsClosest}m</div>`;
        } else if (!hipCanTrackAt3m) {
            const hipClosest = Math.ceil(270 / hipYaw);
            statusBox.style.display = 'block';
            statusBox.innerHTML = `<div style="color: #ff6666; font-size: 16px; font-weight: bold;">⚠️ Hip Fire: Cannot track closer than ${hipClosest}m - Increase speed!</div>`;
        } else {
            const adsClosest = Math.ceil(135 / adsYaw);
            statusBox.style.display = 'block';
            statusBox.innerHTML = `<div style="color: #ff6666; font-size: 16px; font-weight: bold;">⚠️ ADS: Cannot track closer than ${adsClosest}m - Increase ADS speed!</div>`;
        }
    }
    
    drawDiagonalVisualization() {
        const ctx = this.contexts.diagonalCanvas;
        const canvas = this.canvases.diagonalCanvas;
        const width = canvas.width;
        const height = canvas.height;
        const centerX = width / 2;
        const centerY = height / 2;
        const maxRadius = Math.min(centerX, centerY) - 40;
        
        ctx.clearRect(0, 0, width, height);
        ctx.fillStyle = CONSTANTS.COLORS.GRID;
        ctx.fillRect(0, 0, width, height);
        
        ctx.strokeStyle = CONSTANTS.COLORS.GRID;
        ctx.lineWidth = 1;
        
        ctx.beginPath();
        ctx.moveTo(centerX - maxRadius, centerY);
        ctx.lineTo(centerX + maxRadius, centerY);
        ctx.moveTo(centerX, centerY - maxRadius);
        ctx.lineTo(centerX, centerY + maxRadius);
        ctx.stroke();
        
        ctx.strokeStyle = '#444';
        ctx.setLineDash([5, 5]);
        ctx.beginPath();
        const diag = maxRadius * 0.707;
        ctx.moveTo(centerX - diag, centerY - diag);
        ctx.lineTo(centerX + diag, centerY + diag);
        ctx.moveTo(centerX - diag, centerY + diag);
        ctx.lineTo(centerX + diag, centerY - diag);
        ctx.stroke();
        ctx.setLineDash([]);
        
        ctx.strokeStyle = '#555';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(centerX, centerY, maxRadius * 0.7, 0, Math.PI * 2);
        ctx.stroke();
        
        const hipYaw = this.state.yawSpeed;
        const hipPitch = this.state.pitchSpeed;
        const adsYaw = this.state.adsYawSpeed;
        const adsPitch = this.state.adsPitchSpeed;
        
        ctx.save();
        ctx.translate(centerX - centerX/2, centerY);
        const hipScaleX = 1;
        const hipScaleY = hipPitch / hipYaw;
        ctx.scale(hipScaleX, hipScaleY);
        ctx.strokeStyle = CONSTANTS.COLORS.TEXT_WHITE;
        ctx.lineWidth = 3 / Math.max(hipScaleX, hipScaleY);
        ctx.shadowBlur = 10;
        ctx.shadowColor = CONSTANTS.COLORS.TEXT_WHITE;
        ctx.beginPath();
        ctx.arc(0, 0, maxRadius * 0.5, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
        
        ctx.save();
        ctx.translate(centerX + centerX/2, centerY);
        const adsScaleX = 1;
        const adsScaleY = adsPitch / adsYaw;
        ctx.scale(adsScaleX, adsScaleY);
        ctx.strokeStyle = CONSTANTS.COLORS.PRIMARY;
        ctx.lineWidth = 3 / Math.max(adsScaleX, adsScaleY);
        ctx.shadowBlur = 10;
        ctx.shadowColor = CONSTANTS.COLORS.PRIMARY;
        ctx.beginPath();
        ctx.arc(0, 0, maxRadius * 0.5, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
        
        ctx.shadowBlur = 0;
        
        ctx.fillStyle = CONSTANTS.COLORS.TEXT_LIGHT;
        ctx.font = '12px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('Hip Fire', centerX - centerX/2, height - 20);
        ctx.fillText('ADS', centerX + centerX/2, height - 20);
        
        ctx.fillStyle = CONSTANTS.COLORS.AXES;
        ctx.fillText('Perfect Circle Reference', centerX, 20);
    }
    
    drawAimAssist() {
        const ctx = this.contexts.aimAssistCanvas;
        const canvas = this.canvases.aimAssistCanvas;
        const width = canvas.width;
        const height = canvas.height;
        const padding = 40;
        const graphWidth = width - 2 * padding;
        const graphHeight = height - 2 * padding;
        
        ctx.clearRect(0, 0, width, height);
        ctx.fillStyle = CONSTANTS.COLORS.GRID;
        ctx.fillRect(0, 0, width, height);
        
        ctx.strokeStyle = CONSTANTS.COLORS.GRID;
        ctx.lineWidth = 1;
        
        if (this.aaViewMode === 'hipfire') {
            const distances = [0, 3, 10, 20, 33, 40];
            distances.forEach((dist) => {
                const x = padding + (dist / 40) * graphWidth;
                ctx.beginPath();
                ctx.moveTo(x, padding);
                ctx.lineTo(x, height - padding);
                ctx.stroke();
                
                ctx.fillStyle = CONSTANTS.COLORS.AXES;
                ctx.font = '10px Arial';
                ctx.textAlign = 'center';
                ctx.fillText(dist + 'm', x, height - padding + 15);
            });
            
            ctx.fillStyle = CONSTANTS.COLORS.NO_AA_ZONE;
            ctx.fillRect(padding, padding, (3/40) * graphWidth, graphHeight);
            ctx.fillRect(padding + (33/40) * graphWidth, padding, (7/40) * graphWidth, graphHeight);
            
            ctx.fillStyle = CONSTANTS.COLORS.AA_ACTIVE_ZONE;
            ctx.fillRect(padding + (3/40) * graphWidth, padding, (30/40) * graphWidth, graphHeight);
            
            ctx.strokeStyle = CONSTANTS.COLORS.PRIMARY;
            ctx.lineWidth = 3;
            ctx.shadowBlur = 10;
            ctx.shadowColor = CONSTANTS.COLORS.PRIMARY;
            ctx.beginPath();
            
            for (let i = 0; i <= 40; i++) {
                const distance = i;
                let aaStrength = 0;
                
                if (distance >= 3 && distance <= 33) {
                    aaStrength = CONSTANTS.AA.STRENGTH;
                }
                
                const x = padding + (distance / 40) * graphWidth;
                const y = height - padding - (aaStrength / CONSTANTS.AA.STRENGTH * graphHeight * 0.8);
                
                if (i === 0) {
                    ctx.moveTo(x, y);
                } else {
                    ctx.lineTo(x, y);
                }
            }
            
            ctx.stroke();
            ctx.shadowBlur = 0;
            
            ctx.strokeStyle = CONSTANTS.COLORS.TEXT_LIGHT;
            ctx.lineWidth = 2;
            ctx.beginPath();
            
            for (let i = 0; i <= 40; i++) {
                const distance = i;
                let bubbleSize = 0;
                
                if (distance >= 3 && distance <= 33) {
                    bubbleSize = 1 - (distance - 3) / 30 * 0.7;
                }
                
                const x = padding + (distance / 40) * graphWidth;
                const y = height - padding - (bubbleSize * graphHeight * 0.8);
                
                if (i === 0) {
                    ctx.moveTo(x, y);
                } else {
                    ctx.lineTo(x, y);
                }
            }
            
            ctx.stroke();
            
        } else {
            const distances = [0, 10, 25, 50, 75, 100];
            distances.forEach((dist) => {
                const x = padding + (dist / 100) * graphWidth;
                ctx.beginPath();
                ctx.moveTo(x, padding);
                ctx.lineTo(x, height - padding);
                ctx.stroke();
                
                ctx.fillStyle = CONSTANTS.COLORS.AXES;
                ctx.font = '10px Arial';
                ctx.textAlign = 'center';
                ctx.fillText(dist + 'm', x, height - padding + 15);
            });
            
            ctx.strokeStyle = CONSTANTS.COLORS.PRIMARY;
            ctx.lineWidth = 3;
            ctx.shadowBlur = 10;
            ctx.shadowColor = CONSTANTS.COLORS.PRIMARY;
            ctx.beginPath();
            ctx.moveTo(padding, height - padding - CONSTANTS.AA.STRENGTH * graphHeight * 0.8);
            ctx.lineTo(width - padding, height - padding - CONSTANTS.AA.STRENGTH * graphHeight * 0.8);
            ctx.stroke();
            ctx.shadowBlur = 0;
            
            ctx.strokeStyle = CONSTANTS.COLORS.TEXT_LIGHT;
            ctx.lineWidth = 2;
            ctx.beginPath();
            
            for (let i = 0; i <= 100; i++) {
                const distance = i;
                const bubbleSize = Math.exp(-distance / 30);
                
                const x = padding + (distance / 100) * graphWidth;
                const y = height - padding - (bubbleSize * graphHeight * 0.8);
                
                if (i === 0) {
                    ctx.moveTo(x, y);
                } else {
                    ctx.lineTo(x, y);
                }
            }
            
            ctx.stroke();
            
            ctx.fillStyle = 'rgba(120, 40, 40, 0.1)';
            ctx.fillRect(padding + (50/100) * graphWidth, padding, (50/100) * graphWidth, graphHeight);
            
            ctx.fillStyle = CONSTANTS.COLORS.AXES;
            ctx.font = '12px Arial';
            ctx.textAlign = 'center';
            ctx.fillText('Practical Limit', padding + (75/100) * graphWidth, padding + 20);
        }
        
        ctx.strokeStyle = CONSTANTS.COLORS.AXES;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(padding, height - padding);
        ctx.lineTo(width - padding, height - padding);
        ctx.moveTo(padding, padding);
        ctx.lineTo(padding, height - padding);
        ctx.stroke();
        
        ctx.fillStyle = CONSTANTS.COLORS.TEXT_LIGHT;
        ctx.font = '12px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('Distance (meters)', width / 2, height - 5);
        
        ctx.font = '11px Arial';
        ctx.textAlign = 'left';
        
        ctx.fillStyle = CONSTANTS.COLORS.PRIMARY;
        ctx.fillText('AA Strength (30%)', width - 130, 20);
        
        ctx.fillStyle = CONSTANTS.COLORS.TEXT_LIGHT;
        ctx.fillText('Bubble Size', width - 130, 35);
    }
    
    draw3DAimAssist() {
        const ctx = this.contexts.aimAssist3DCanvas;
        const canvas = this.canvases.aimAssist3DCanvas;
        if (!ctx || !canvas) return;
        
        const width = canvas.width;
        const height = canvas.height;
        const centerX = width / 2;
        const centerY = height / 2;
        
        // Clear canvas
        ctx.clearRect(0, 0, width, height);
        ctx.fillStyle = '#2a2a2a';
        ctx.fillRect(0, 0, width, height);
        
        // Auto-rotation
        if (this.autoRotate3D) {
            this.rotation3D.y += 0.01;
        }
        
        // 3D projection function
        const project3D = (x, y, z) => {
            // Apply rotation
            const cosX = Math.cos(this.rotation3D.x);
            const sinX = Math.sin(this.rotation3D.x);
            const cosY = Math.cos(this.rotation3D.y);
            const sinY = Math.sin(this.rotation3D.y);
            
            // Rotate around Y axis
            const x1 = x * cosY - z * sinY;
            const z1 = x * sinY + z * cosY;
            
            // Rotate around X axis
            const y1 = y * cosX - z1 * sinX;
            const z2 = y * sinX + z1 * cosX;
            
            // Perspective projection
            const scale = 300 / (z2 + 500);
            return {
                x: centerX + x1 * scale,
                y: centerY + y1 * scale,
                scale: scale,
                z: z2
            };
        };
        
        // Draw grid floor centered at origin
        ctx.strokeStyle = '#444';
        ctx.lineWidth = 1;
        
        // X-axis lines (perpendicular to view direction)
        for (let x = -250; x <= 250; x += 50) {
            const start = project3D(x, 50, -50);
            const end = project3D(x, 50, 400);
            ctx.beginPath();
            ctx.moveTo(start.x, start.y);
            ctx.lineTo(end.x, end.y);
            ctx.stroke();
        }
        
        // Z-axis lines (along view direction)
        for (let z = -50; z <= 400; z += 50) {
            const start = project3D(-250, 50, z);
            const end = project3D(250, 50, z);
            ctx.beginPath();
            ctx.moveTo(start.x, start.y);
            ctx.lineTo(end.x, end.y);
            ctx.stroke();
        }
        
        // Draw coordinate axes for reference
        ctx.strokeStyle = '#666';
        ctx.lineWidth = 2;
        
        // X-axis (red)
        ctx.strokeStyle = '#663333';
        const xStart = project3D(-100, 0, 0);
        const xEnd = project3D(100, 0, 0);
        ctx.beginPath();
        ctx.moveTo(xStart.x, xStart.y);
        ctx.lineTo(xEnd.x, xEnd.y);
        ctx.stroke();
        
        // Z-axis (blue) - forward direction
        ctx.strokeStyle = '#333366';
        const zStart = project3D(0, 0, -50);
        const zEnd = project3D(0, 0, 150);
        ctx.beginPath();
        ctx.moveTo(zStart.x, zStart.y);
        ctx.lineTo(zEnd.x, zEnd.y);
        ctx.stroke();
        
        // Draw player position at origin
        const playerPos = project3D(0, 0, 0);
        ctx.fillStyle = '#ff6b00';
        ctx.shadowBlur = 10;
        ctx.shadowColor = '#ff6b00';
        ctx.beginPath();
        ctx.arc(playerPos.x, playerPos.y, 6, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
        
        // Draw aim assist visualization based on mode
        if (this.aaViewMode === 'hipfire') {
            // Hip fire: 3-33m range
            const minDist = 30;  // 3m scaled
            const maxDist = 330; // 33m scaled
            
            // Draw aim assist cone segments
            for (let dist = minDist; dist <= maxDist; dist += 30) {
                const bubbleSize = 1 - ((dist/10 - 3) / 30 * 0.7);
                const radius = bubbleSize * 40;
                
                // Draw cone at this distance
                ctx.strokeStyle = `rgba(255, 107, 0, ${0.5 - dist/maxDist * 0.3})`;
                ctx.lineWidth = 2;
                
                // Draw circle at distance
                const numPoints = 32;
                ctx.beginPath();
                for (let i = 0; i <= numPoints; i++) {
                    const angle = (i / numPoints) * Math.PI * 2;
                    const x = Math.cos(angle) * radius;
                    const y = Math.sin(angle) * radius;
                    const point = project3D(x, y, dist);
                    
                    if (i === 0) {
                        ctx.moveTo(point.x, point.y);
                    } else {
                        ctx.lineTo(point.x, point.y);
                    }
                }
                ctx.closePath();
                ctx.stroke();
                
                // Fill the circle with semi-transparent color
                ctx.fillStyle = `rgba(255, 107, 0, ${0.1 - dist/maxDist * 0.08})`;
                ctx.fill();
                
                // Draw cone lines from player to edges
                if (dist === minDist || dist === maxDist) {
                    ctx.strokeStyle = `rgba(255, 107, 0, 0.4)`;
                    ctx.lineWidth = 1;
                    for (let i = 0; i < 8; i++) {
                        const angle = (i / 8) * Math.PI * 2;
                        const x = Math.cos(angle) * radius;
                        const y = Math.sin(angle) * radius;
                        
                        const start = project3D(0, 0, 0);
                        const end = project3D(x, y, dist);
                        
                        ctx.beginPath();
                        ctx.moveTo(start.x, start.y);
                        ctx.lineTo(end.x, end.y);
                        ctx.stroke();
                    }
                }
                
                // Draw optimal range indicator
                if (dist >= 100 && dist <= 200) { // 10-20m is optimal
                    const optimalLabel = project3D(0, -radius - 20, dist);
                    ctx.fillStyle = 'rgba(0, 255, 100, 0.3)';
                    ctx.fillRect(optimalLabel.x - 35, optimalLabel.y - 10, 70, 20);
                    ctx.fillStyle = '#00ff66';
                    ctx.font = '10px Arial';
                    ctx.textAlign = 'center';
                    ctx.fillText('Optimal', optimalLabel.x, optimalLabel.y + 3);
                }
            }
            
            // Draw no-AA zones with better positioning
            ctx.fillStyle = 'rgba(120, 40, 40, 0.4)';
            
            // Near zone (< 3m)
            const nearZone = project3D(0, -30, minDist/2);
            ctx.fillRect(nearZone.x - 50, nearZone.y - 15, 100, 30);
            ctx.fillStyle = '#ff6666';
            ctx.font = '12px Arial';
            ctx.textAlign = 'center';
            ctx.fillText('No AA < 3m', nearZone.x, nearZone.y + 5);
            
            // Far zone (> 33m)
            const farZone = project3D(0, -30, maxDist + 50);
            ctx.fillStyle = 'rgba(120, 40, 40, 0.4)';
            ctx.fillRect(farZone.x - 50, farZone.y - 15, 100, 30);
            ctx.fillStyle = '#ff6666';
            ctx.fillText('No AA > 33m', farZone.x, farZone.y + 5);
            
        } else {
            // ADS: Exponential falloff
            const maxDist = 400;
            
            // Draw aim assist bubble at different distances
            for (let dist = 10; dist <= maxDist; dist += 30) {
                const bubbleSize = Math.exp(-dist/10 / 30);
                const radius = bubbleSize * 60;
                
                if (radius < 5) continue; // Skip very small bubbles
                
                ctx.strokeStyle = `rgba(255, 107, 0, ${bubbleSize * 0.6})`;
                ctx.lineWidth = 2;
                
                // Draw sphere approximation using circles
                const numPoints = 32;
                ctx.beginPath();
                for (let i = 0; i <= numPoints; i++) {
                    const angle = (i / numPoints) * Math.PI * 2;
                    const x = Math.cos(angle) * radius;
                    const y = Math.sin(angle) * radius;
                    const point = project3D(x, y, dist);
                    
                    if (i === 0) {
                        ctx.moveTo(point.x, point.y);
                    } else {
                        ctx.lineTo(point.x, point.y);
                    }
                }
                ctx.closePath();
                ctx.stroke();
                
                // Fill with semi-transparent color
                ctx.fillStyle = `rgba(255, 107, 0, ${bubbleSize * 0.15})`;
                ctx.fill();
                
                // Draw optimal range indicator for ADS
                if (dist >= 50 && dist <= 150) { // 10-30m is optimal for ADS
                    const optimalLabel = project3D(0, -radius - 20, dist);
                    ctx.fillStyle = 'rgba(0, 255, 100, 0.3)';
                    ctx.fillRect(optimalLabel.x - 35, optimalLabel.y - 10, 70, 20);
                    ctx.fillStyle = '#00ff66';
                    ctx.font = '10px Arial';
                    ctx.textAlign = 'center';
                    ctx.fillText('Optimal', optimalLabel.x, optimalLabel.y + 3);
                }
            }
            
            // Draw center line showing view direction
            ctx.strokeStyle = 'rgba(255, 107, 0, 0.2)';
            ctx.lineWidth = 2;
            ctx.setLineDash([5, 5]);
            const lineStart = project3D(0, 0, 0);
            const lineEnd = project3D(0, 0, maxDist);
            ctx.beginPath();
            ctx.moveTo(lineStart.x, lineStart.y);
            ctx.lineTo(lineEnd.x, lineEnd.y);
            ctx.stroke();
            ctx.setLineDash([]);
            
            // Draw practical limit zone
            const limitZone = project3D(0, -30, 300);
            ctx.fillStyle = 'rgba(120, 40, 40, 0.3)';
            ctx.fillRect(limitZone.x - 60, limitZone.y - 15, 120, 30);
            ctx.fillStyle = '#ff6666';
            ctx.font = '12px Arial';
            ctx.textAlign = 'center';
            ctx.fillText('Practical Limit', limitZone.x, limitZone.y + 5);
        }
        
        // Draw distance markers on the floor
        ctx.fillStyle = '#999';
        ctx.font = '11px Arial';
        ctx.textAlign = 'center';
        
        const distances = this.aaViewMode === 'hipfire' 
            ? [0, 30, 100, 200, 330] 
            : [0, 50, 150, 250, 350];
        
        distances.forEach(dist => {
            const point = project3D(0, 48, dist);
            const label = dist === 0 ? 'Player' : `${dist/10}m`;
            ctx.fillText(label, point.x, point.y);
        });
        
        // Draw legend
        ctx.fillStyle = '#ff6b00';
        ctx.font = '14px Arial';
        ctx.textAlign = 'left';
        ctx.fillText(this.aaViewMode === 'hipfire' ? 'Hip Fire AA Cone' : 'ADS AA Falloff', 20, 30);
        
        ctx.fillStyle = '#999';
        ctx.font = '11px Arial';
        ctx.fillText('Bubble size shows AA effectiveness', 20, 50);
        ctx.fillText('Orange intensity shows AA strength', 20, 65);
        
        // Draw AA strength indicator
        const strengthY = 90;
        ctx.fillText('AA Strength: 30%', 20, strengthY);
        ctx.fillStyle = 'rgba(255, 107, 0, 0.8)';
        ctx.fillRect(20, strengthY + 5, 100 * 0.3, 10);
        ctx.strokeStyle = '#666';
        ctx.strokeRect(20, strengthY + 5, 100, 10);
    }
    
    drawSpeedComparison() {
        const ctx = this.contexts.speedComparisonCanvas;
        const canvas = this.canvases.speedComparisonCanvas;
        const width = canvas.width;
        const height = canvas.height;
        const padding = 40;
        const graphWidth = width - 2 * padding;
        const graphHeight = height - 2 * padding;
        
        ctx.clearRect(0, 0, width, height);
        ctx.fillStyle = CONSTANTS.COLORS.GRID;
        ctx.fillRect(0, 0, width, height);
        
        const hipBase = this.state.yawSpeed;
        const hipMax = this.state.yawSpeed + this.state.extraYaw;
        const adsBase = this.state.adsYawSpeed;
        const adsMax = this.state.adsYawSpeed + this.state.adsExtraYaw;
        
        const maxSpeed = Math.max(hipBase, hipMax, adsBase, adsMax);
        const scale = graphHeight / (maxSpeed * 1.1);
        
        ctx.strokeStyle = CONSTANTS.COLORS.GRID;
        ctx.lineWidth = 1;
        
        for (let i = 0; i <= 5; i++) {
            const y = padding + (i / 5) * graphHeight;
            ctx.beginPath();
            ctx.moveTo(padding, y);
            ctx.lineTo(width - padding, y);
            ctx.stroke();
            
            const speed = Math.round((1 - i / 5) * maxSpeed * 1.1);
            ctx.fillStyle = CONSTANTS.COLORS.AXES;
            ctx.font = '10px Arial';
            ctx.textAlign = 'right';
            ctx.fillText(speed + '°/s', padding - 5, y + 3);
        }
        
        const barWidth = graphWidth / 8;
        const barSpacing = graphWidth / 4;
        
        const bars = [
            { label: 'Hip Base', value: hipBase, color: CONSTANTS.COLORS.AXES, x: padding + barSpacing - barWidth * 1.5 },
            { label: 'Hip Max', value: hipMax, color: CONSTANTS.COLORS.TEXT_WHITE, x: padding + barSpacing - barWidth * 0.5 },
            { label: 'ADS Base', value: adsBase, color: CONSTANTS.COLORS.AXES, x: padding + barSpacing * 3 - barWidth * 1.5 },
            { label: 'ADS Max', value: adsMax, color: CONSTANTS.COLORS.PRIMARY, x: padding + barSpacing * 3 - barWidth * 0.5 }
        ];
        
        bars.forEach(bar => {
            const barHeight = bar.value * scale;
            
            const gradient = ctx.createLinearGradient(0, height - padding - barHeight, 0, height - padding);
            gradient.addColorStop(0, bar.color);
            gradient.addColorStop(1, CONSTANTS.COLORS.GRID);
            
            ctx.fillStyle = gradient;
            ctx.fillRect(bar.x, height - padding - barHeight, barWidth, barHeight);
            
            ctx.strokeStyle = bar.color;
            ctx.lineWidth = 2;
            ctx.strokeRect(bar.x, height - padding - barHeight, barWidth, barHeight);
            
            ctx.fillStyle = bar.color;
            ctx.font = '11px Arial';
            ctx.textAlign = 'center';
            ctx.fillText(bar.value + '°/s', bar.x + barWidth / 2, height - padding - barHeight - 5);
            
            ctx.fillStyle = CONSTANTS.COLORS.TEXT_LIGHT;
            ctx.fillText(bar.label, bar.x + barWidth / 2, height - padding + 15);
        });
        
        ctx.strokeStyle = CONSTANTS.COLORS.AXES;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(padding, height - padding);
        ctx.lineTo(width - padding, height - padding);
        ctx.moveTo(padding, padding);
        ctx.lineTo(padding, height - padding);
        ctx.stroke();
    }
    
    startAnimation() {
        const animate = () => {
            this.drawDeadzone();
            if (this.autoRotate3D) {
                this.draw3DAimAssist();
            }
            this.animationId = requestAnimationFrame(animate);
        };
        animate();
    }
    
    destroy() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
    }
}

// Initialize app when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        const app = new ALCAnalyzer();
        
        window.addEventListener('beforeunload', () => {
            app.destroy();
        });
    });
} else {
    const app = new ALCAnalyzer();
    
    window.addEventListener('beforeunload', () => {
        app.destroy();
    });
}
