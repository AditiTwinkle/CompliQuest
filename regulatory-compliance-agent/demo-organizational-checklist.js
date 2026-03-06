#!/usr/bin/env node

/**
 * Demo script for organizational checklist model
 * Shows the mock organizational data for DORA compliance
 */

const { organizationalChecklistService } = require('./dist/services/organizationalChecklistService');
const { mockOrganizationalData } = require('./dist/services/mockOrganizationalData');

async function demonstrateOrganizationalChecklist() {
  console.log('🏦 Regulatory Compliance Agent - Organizational Checklist Demo\n');
  
  // Get demo organization
  const organization = mockOrganizationalData.getMockOrganization();
  console.log('📋 Demo Organization:');
  console.log(`   Name: ${organization.name}`);
  console.log(`   Industry: ${organization.industry}`);
  console.log(`   Size: ${organization.size}`);
  console.log(`   Jurisdiction: ${organization.jurisdiction}\n`);
  
  // Get organizational checklist
  const checklist = await organizationalChecklistService.getOrganizationalChecklist(
    organization.id, 
    'dora-2022'
  );
  
  if (checklist) {
    console.log('📊 DORA Compliance Checklist:');
    console.log(`   Framework: ${checklist.framework.name}`);
    console.log(`   Total Controls: ${checklist.controls.length}`);
    console.log(`   Overall Compliance: ${checklist.compliancePercentage}%`);
    console.log(`   Maturity Level: ${checklist.overallMaturity}\n`);
    
    // Show compliance status breakdown
    const status = await organizationalChecklistService.calculateComplianceStatus(
      organization.id,
      'dora-2022'
    );
    
    console.log('🎯 Compliance Status Breakdown:');
    console.log(`   ✅ Fully Implemented: ${status.implementedControls}`);
    console.log(`   🔄 Partially Implemented: ${status.partiallyImplementedControls}`);
    console.log(`   ❌ Not Implemented: ${status.notImplementedControls}\n`);
    
    // Show controls by category
    console.log('🏗️ Controls by Implementation Status:');
    
    const fullyImplemented = checklist.controls.filter(c => c.implementationStatus === 'FULLY_IMPLEMENTED');
    const partiallyImplemented = checklist.controls.filter(c => c.implementationStatus === 'PARTIALLY_IMPLEMENTED');
    const notImplemented = checklist.controls.filter(c => c.implementationStatus === 'NOT_IMPLEMENTED');
    
    console.log('\n   ✅ Fully Implemented Controls:');
    fullyImplemented.forEach(control => {
      console.log(`      • ${control.name} (${control.category})`);
    });
    
    console.log('\n   🔄 Partially Implemented Controls:');
    partiallyImplemented.forEach(control => {
      console.log(`      • ${control.name} (${control.category})`);
    });
    
    console.log('\n   ❌ Not Implemented Controls:');
    notImplemented.forEach(control => {
      console.log(`      • ${control.name} (${control.category})`);
    });
    
    // Show identified gaps
    const gaps = mockOrganizationalData.getMockIdentifiedGaps();
    console.log('\n🚨 Identified Compliance Gaps:');
    gaps.forEach(gap => {
      console.log(`   • ${gap.description} (${gap.severity} severity)`);
    });
    
    console.log('\n✨ Organizational checklist model is ready for gap analysis and question generation!');
  } else {
    console.log('❌ No checklist found for demo organization');
  }
}

// Run the demo
demonstrateOrganizationalChecklist().catch(console.error);