import SwiftUI

struct ProjectWorkspaceView: View {
    @State private var viewModel = WorkspaceViewModel()
    @State private var commentText = ""
    
    var body: some View {
        ScrollView {
            if let project = viewModel.activeProject {
                VStack(alignment: .leading, spacing: 20) {
                    
                    // Headboard details
                    VStack(alignment: .leading, spacing: 4) {
                        Text(project.title)
                            .font(.title2)
                            .fontWeight(.bold)
                            .foregroundColor(ThemeColors.textMain)
                        
                        Text("Business: \(project.businessName) | Artist: \(project.artistName)")
                            .font(.caption)
                            .foregroundColor(ThemeColors.textMuted)
                    }
                    .padding(.horizontal)
                    
                    // Role Switcher Toggle
                    Picker("Role", selection: $viewModel.activeRole) {
                        Text("Business View").tag("business")
                        Text("Artist View").tag("artist")
                    }
                    .pickerStyle(.segmented)
                    .padding(.horizontal)
                    
                    // Progress HUD Card
                    VStack(alignment: .leading, spacing: 12) {
                        HStack {
                            Text("Facade Progress")
                                .font(.headline)
                            Spacer()
                            Text("\(project.progress)%")
                                .font(.title3)
                                .fontWeight(.black)
                                .foregroundColor(ThemeColors.electricPurple)
                        }
                        
                        ProgressView(value: Double(project.progress), total: 100)
                            .tint(ThemeColors.electricPurple)
                        
                        if viewModel.activeRole == "artist" {
                            VStack(spacing: 8) {
                                Slider(value: Binding(
                                    get: { Double(project.progress) },
                                    set: { viewModel.updateProgress(projectId: project.id, progress: Int($0)) }
                                ), in: 0...100, step: 5)
                                
                                Text("Slide to update client progress milestones")
                                    .font(.caption2)
                                    .foregroundColor(ThemeColors.textMuted)
                            }
                        } else {
                            if project.progress == 100 && !project.isFinalPaid {
                                Button(action: {
                                    viewModel.activeCheckoutType = "final"
                                    viewModel.isStripeSheetOpen = true
                                }) {
                                    Text("Release Final Escrow Payout ($1,250)")
                                        .fontWeight(.bold)
                                        .frame(maxWidth: .infinity)
                                        .padding()
                                        .background(ThemeColors.emeraldGreen)
                                        .foregroundColor(.white)
                                        .cornerRadius(12)
                                }
                            }
                        }
                    }
                    .cardStyle()
                    .padding(.horizontal)
                    
                    // Timeline steps
                    VStack(alignment: .leading, spacing: 16) {
                        Text("Milestones Timeline")
                            .font(.headline)
                            .foregroundColor(ThemeColors.textMain)
                        
                        ForEach(project.timeline, id: \.self) { step in
                            HStack(alignment: .top, spacing: 16) {
                                Circle()
                                    .fill(step.status == .done ? ThemeColors.emeraldGreen :
                                            (step.status == .current ? ThemeColors.electricPurple : ThemeColors.textMuted))
                                    .frame(width: 12, height: 12)
                                    .padding(.top, 4)
                                
                                VStack(alignment: .leading, spacing: 2) {
                                    Text(step.name)
                                        .font(.subheadline)
                                        .fontWeight(.semibold)
                                        .foregroundColor(ThemeColors.textMain)
                                    Text(step.description)
                                        .font(.caption)
                                        .foregroundColor(ThemeColors.textMuted)
                                }
                                Spacer()
                            }
                        }
                    }
                    .cardStyle()
                    .padding(.horizontal)
                    
                    // Comments HUD
                    VStack(alignment: .leading, spacing: 12) {
                        Text("Activity Comments")
                            .font(.headline)
                        
                        ScrollView {
                            LazyVStack(alignment: .leading, spacing: 10) {
                                ForEach(project.updates) { u in
                                    VStack(alignment: .leading, spacing: 2) {
                                        HStack {
                                            Text(u.user)
                                                .fontWeight(.bold)
                                                .font(.caption)
                                                .foregroundColor(ThemeColors.electricPurple)
                                            Spacer()
                                            Text(u.time)
                                                .font(.system(size: 9))
                                                .foregroundColor(ThemeColors.textMuted)
                                        }
                                        Text(u.text)
                                            .font(.footnote)
                                            .foregroundColor(ThemeColors.textMain)
                                    }
                                    .padding(8)
                                    .background(Color.white.opacity(0.02))
                                    .cornerRadius(6)
                                }
                            }
                        }
                        .frame(height: 150)
                        
                        HStack {
                            TextField("Post message...", text: $commentText)
                                .textFieldStyle(.plain)
                                .padding(10)
                                .background(Color.black.opacity(0.3))
                                .cornerRadius(8)
                            
                            Button("Send") {
                                let author = viewModel.activeRole == "artist" ? project.artistName : project.businessName
                                viewModel.postComment(projectId: project.id, text: commentText, sender: author)
                                commentText = ""
                            }
                            .foregroundColor(ThemeColors.electricPurple)
                            .fontWeight(.bold)
                        }
                    }
                    .cardStyle()
                    .padding(.horizontal)
                }
                .padding(.vertical)
                .sheet(isPresented: $viewModel.isStripeSheetOpen) {
                    VStack(spacing: 20) {
                        Text("Stripe Secure Escrow")
                            .font(.headline)
                        
                        Text("Release Final Milestone Payment")
                            .font(.subheadline)
                            
                        Button("Confirm Escrow Release") {
                            viewModel.executeStripePayment(projectId: project.id)
                        }
                        .padding()
                        .background(ThemeColors.electricPurple)
                        .foregroundColor(.white)
                        .cornerRadius(10)
                    }
                    .padding()
                    .presentationDetents([.fraction(0.35)])
                }
            } else {
                ProgressView()
            }
        }
        .background(ThemeColors.obsidianBg.ignoresSafeArea())
    }
}
