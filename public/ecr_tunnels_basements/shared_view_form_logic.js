// 🔄 Universal script for pre-filling and viewing form with Approve button
const urlParams = new URLSearchParams(window.location.search);
const submissionId = urlParams.get('id');
// New: Check for 'disableApproval' URL parameter
const disableApproval = urlParams.has('disableApproval');

// ✅ Automatically enable view mode if a valid submissionId exists
const isViewMode = submissionId && !isNaN(parseInt(submissionId));

console.log('shared_view_form_logic.js loaded.');
console.log('shared_view_form_logic.js: URL Params:', window.location.search);
console.log('shared_view_form_logic.js: Detected submissionId:', submissionId);
console.log('shared_view_form_logic.js: Computed isViewMode:', isViewMode);
console.log('shared_view_form_logic.js: Detected disableApproval:', disableApproval);

// --- START: Master Config Dropdown Population Functions ---
function populateDropdown(id, items) {
    const el = document.getElementById(id);
    if (!el) {
        console.warn(`Dropdown element with ID '${id}' not found.`);
        return;
    }
    const currentValue = el.value; // Store currently selected value
    el.innerHTML = '<option value="">Select</option>'; // Clear existing options and add default
    items.forEach(val => {
        const opt = document.createElement('option');
        opt.value = val;
        opt.textContent = val;
        el.appendChild(opt);
    });
    // Attempt to restore value if it was set before options were updated
    if (currentValue && Array.from(el.options).some(option => option.value === currentValue)) {
        el.value = currentValue;
    }
}

async function loadMasterConfigToFormDropdowns() {
    if (isViewMode) {
        console.log('shared_view_form_logic.js: In view mode, skipping master config dropdown population.');
        return;
    }
    console.log('shared_view_form_logic.js: Loading master config to form dropdowns from public API.');
    try {
        const response = await fetch('/api/public-master-config');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const config = await response.json();
        console.log('shared_view_form_logic.js: Fetched public master config:', config);
        
        populateDropdown('technician', config.technicians || []); 
        populateDropdown('incharge', config.shiftIncharges || []); 

    } catch (error) {
        console.error('shared_view_form_logic.js: Error fetching master config:', error);
    }
}
// --- END: Master Config Dropdown Population Functions ---

window.addEventListener('DOMContentLoaded', async () => {
  console.log('shared_view_form_logic.js: DOMContentLoaded fired.');

  // Conditionally load dropdowns: only if NOT in view mode
  if (!isViewMode) {
    await loadMasterConfigToFormDropdowns();
  }

  window.addEventListener('message', (event) => {
    if (event.origin !== window.location.origin) { 
      console.warn('shared_view_form_logic.js: Message received from untrusted origin:', event.origin);
      return;
    }

    if (event.data && event.data.type === 'masterConfigUpdated' && !isViewMode) {
      console.log('shared_view_form_logic.js: Received masterConfigUpdated event from parent. Reloading dropdowns.');
      loadMasterConfigToFormDropdowns(); 
    }
  });

  const submitBtn = document.querySelector('button[type="submit"]');
  const approveBtn = document.getElementById('approveButton');
  const checkSheetForm = document.getElementById('checkSheetForm');
  const checkboxRemarkGroup = document.querySelector('.checkbox-remark-group');
  const finalRemarkArea = document.querySelector('.final-remark-area');
  const approverRemarkField = document.getElementById('approverRemark');

  if (!isViewMode) {
    console.warn("shared_view_form_logic.js: Not in view mode. Form will remain editable.");
    if (approveBtn) approveBtn.style.display = 'none';
    if (submitBtn) submitBtn.style.display = 'block';
    return;
  }

  console.log('shared_view_form_logic.js: Entering view mode logic for submission ID:', submissionId);
  if (submitBtn) submitBtn.style.display = 'none';
  
  if (approveBtn) {
    if (disableApproval) {
      approveBtn.style.display = 'none';
    } else {
      approveBtn.style.display = 'block';
    }
  }

  if (approverRemarkField) {
    if (disableApproval) {
      approverRemarkField.style.display = 'none';
    } else {
      approverRemarkField.style.display = 'block';
    }
  }
  
  console.log('shared_view_form_logic.js: Submit button hidden, Approve button visibility set.');


  if (checkSheetForm) {
    checkSheetForm.addEventListener('submit', (e) => {
      console.log('shared_view_form_logic.js: Preventing form submission in view mode.');
      e.preventDefault();
    });
  }

  try {
    console.log(`shared_view_form_logic.js: Attempting to fetch submission data for ID: ${submissionId}`);
    const res = await fetch(`/api/submission/${submissionId}`);
    console.log('shared_view_form_logic.js: Fetch response received from /api/submission:', res);

    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(`Failed to fetch form data. Status: ${res.status} - ${errorText}`);
    }

    const { submission, formdata } = await res.json();
    console.log('shared_view_form_logic.js: Fetched Data:', { submission, formdata });

    if (!submission || !Array.isArray(formdata) || formdata.length === 0) {
      console.warn("shared_view_form_logic.js: Incomplete or empty submission data received.");
    }

    const backendToFrontendNameMap = {
        technician_ic: 'technician',
        shift_ic: 'incharge'
    };

    const allFormElements = document.querySelectorAll('#checkSheetForm input, #checkSheetForm select, #checkSheetForm textarea');
    allFormElements.forEach(element => {
      if (element.id === 'approverRemark') {
        if (disableApproval) {
          element.disabled = true;
          element.readOnly = true;
          element.style.display = 'none';
        } else {
          element.disabled = false;
          element.readOnly = false;
          element.style.display = 'block';
        }
        return;
      }
      if (element.id === 'approveButton') {
        if (disableApproval) {
          element.disabled = true;
          element.style.display = 'none';
        } else {
          element.disabled = false;
          element.style.display = 'block';
        }
        return;
      }

      if (element.tagName === 'SELECT') {
        element.disabled = true;
      } else if (element.tagName === 'TEXTAREA') {
        element.readOnly = true;
      } else {
        element.readOnly = true;
      }
    });

    if (submission) {
      Object.entries(submission).forEach(([backendKey, val]) => {
        const frontendName = backendToFrontendNameMap[backendKey] || backendKey;
        const el = document.querySelector(`[name="${frontendName}"]`);

        if (el && el.id !== 'approverRemark') {
          if (el.type === 'date' && val) {
            try {
              const formattedDate = new Date(val).toISOString().split('T')[0];
              el.value = formattedDate;
            } catch (e) {
              el.value = val;
            }
          } else if (el.tagName === 'SELECT') {
            if (val && !Array.from(el.options).some(option => option.value === val)) {
                const opt = document.createElement('option');
                opt.value = val;
                opt.textContent = val;
                el.appendChild(opt);
            }
            el.value = val;
          } else {
            el.value = val;
          }
        }
      });
    }

    if (Array.isArray(formdata)) {
      formdata.forEach(({ header_id, line_id, item_id, item_value }) => {
        const inputId = `${header_id}_${line_id}_${item_id}`;
        const input = document.getElementById(inputId);
        if (input) {
          input.value = item_value;
        }
      });
    }

    const finalRemark = document.querySelector('[name="items[2][multiline1]"]');
    if (finalRemark && submission && submission.overall_remark !== null) {
      finalRemark.value = submission.overall_remark;
    }

    const globalRemark = document.getElementById("statusRemark");
    if (globalRemark && submission && submission.filling_remark !== null) {
      globalRemark.value = submission.filling_remark;
    }

    const statusCheckbox = document.getElementById('statusCheckbox');
    if (statusCheckbox) statusCheckbox.style.display = 'none';
    if (globalRemark) globalRemark.style.display = 'none';

    if (checkboxRemarkGroup) {
      checkboxRemarkGroup.style.display = 'none';
    }
    
    if (finalRemarkArea) {
        // Keep it visible if there's content to show, but still readOnly.
    }

    if (submission && submission.approval_status === 'YES') {
      if (approveBtn) {
        approveBtn.disabled = true;
        approveBtn.textContent = 'Approved';
        approveBtn.style.backgroundColor = '#6c757d';
        approveBtn.style.cursor = 'not-allowed';
      }
      if (approverRemarkField) {
        approverRemarkField.readOnly = true;
        approverRemarkField.disabled = true;
      }
    }

  } catch (err) {
    console.error("shared_view_form_logic.js: ❌ Error loading form data:", err);
    alert("Failed to load form data. Check console for more info.");
  }
});

window.addEventListener('DOMContentLoaded', () => {
  const approveBtn = document.getElementById('approveButton');
  const approverRemarkField = document.getElementById('approverRemark');

  if (approveBtn && !disableApproval) {
    approveBtn.addEventListener('click', async () => {
      if (!submissionId) {
        alert("Missing submission ID for approval.");
        return;
      }

      if (approveBtn.disabled) return;

      const confirmApproval = confirm("Are you sure you want to approve this form?");
      if (!confirmApproval) return;

      try {
        const approverRemark = approverRemarkField?.value || '';

        const res = await fetch(`/api/approve/${submissionId}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ approver_remark: approverRemark })
        });

        const result = await res.json();
        if (result.success) {
          alert("✅ Form approved successfully.");
          approveBtn.disabled = true;
          approveBtn.textContent = 'Approved';
          approveBtn.style.backgroundColor = '#6c757d';
          approveBtn.style.cursor = 'not-allowed';
          if (approverRemarkField) {
            approverRemarkField.readOnly = true;
            approverRemarkField.disabled = true;
          }
        } else {
          alert(`❌ Approval failed: ${result.error || 'Unknown error'}`);
        }
      } catch (err) {
        console.error("shared_view_form_logic.js: ❌ Approval error:", err);
        alert("Failed to approve form due to a network or server issue.");
      }
    });
  } else if (approveBtn && disableApproval) {
      approveBtn.style.display = 'none';
  }
});